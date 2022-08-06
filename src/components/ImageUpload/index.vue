<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :fileList.sync="fileList"
      :limit="1"
      :class="{ completed: isCompleted }"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      :percentage="percentage"
      style="width: 200px"
      v-if="showPercent"
    ></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
// 需要实例化
const cos = new COS({
  SecretId: "AKIDypSq0we7OSJwMYXJrEOK3a182iCSUJuI",
  SecretKey: "EF3vZ0FQEoBKGxRghV6b5C5mFTTGxIRM",
  // console.log(cos);
});
export default {
  name: "ImageUpload",
  data() {
    return {
      showPercent: false,
      percentage: 0,
      fileList: [
        {
          url: "https://img0.baidu.com/it/u=857510153,4267238650&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=675",
        },
      ],
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    handleRemove(file, fileList) {
      // file点击的文件
      console.log(file, fileList);
      // this.fileList = this.fileList.filter((item) => item.uid !== file.id);
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      // 当前点击图片对象
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    changeFile(file, fileList) {
      this.fileList = fileList;
    },
    beforeUpload(file) {
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("文件类型不匹配");
        return false;
      }
      // 判断文件大小
      const maxSize = 5 * 1024 * 1024; // 1M=1024KB 1KB = 1024B
      if (file.size > maxSize) {
        this.$message.error("文件太大了");
        return false;
      }
      this.showPercent = true;
    }, // 进行上传操作
    upload({ file }) {
      //   console.log(params.file)
      if (!file) return;
      if (file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: "wu1998-1313213500", // 存储桶
            Region: "ap-shanghai", // 地域
            Key: file.name, // 文件名
            Body: file, // 要上传的文件对象
            StorageClass: "STANDARD",
            onProgress: ({ percent }) => {
              this.percentage = percent * 100;
            },
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            console.log(err || data);
            if (err) {
              return this.$message.error(err?.message || "上传出错");
            }
            this.fileList.forEach((item) => {
              if (item.uid === file.uid) {
                item.url = `http://${data.Location}`;
                // 只有成功获取到了服务端图片链接的时候，加一个标识
                // 目的:提交更新的时候，进行判断，如果当前文件对象里面没有upload属性，不进行提交
                item.upload = true;
              }
            });
            setTimeout(() => {
              this.showPercent = false;
              this.percentage = 0;
            }, 2000);
          }
        );
      }
    },
  },
  computed: {
    isCompleted() {
      return this.fileList.length === 1;
    },
  },
};
</script>

<style scoped lang="scss">
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
