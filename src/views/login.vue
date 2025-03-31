<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">Data Vista 数据智能终端</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width:100%;"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
<!--        <div style="float: right;" v-if="register">-->
<!--          <router-link class="link-type" :to="'/register'">立即注册</router-link>-->
<!--        </div>-->
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2025 data vista All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
// 引入第三方库和工具
import Cookies from "js-cookie"; // 用于操作 Cookie
import { encrypt, decrypt } from "@/utils/jsencrypt"; // 加密/解密工具
import useUserStore from '@/store/modules/user' // 引入 Pinia 用户状态管理

// 获取 Pinia 用户状态管理实例
const userStore = useUserStore();

// 获取 Vue Router 相关的实例
const route = useRoute(); // 获取当前路由信息
const router = useRouter(); // 获取路由操作实例
const { proxy } = getCurrentInstance(); // 获取 Vue 组件实例的代理对象

// 登录表单，使用 ref 创建响应式数据
const loginForm = ref({
  username: "", // 用户名
  password: "" // 密码
});

// 登录表单的校验规则
const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};

// 控制登录按钮的加载状态，防止重复提交
const loading = ref(false);

// 用于存储登录后跳转的地址
const redirect = ref(undefined);

// 监听路由变化，获取重定向参数
watch(route, (newRoute) => {
  redirect.value = newRoute.query && newRoute.query.redirect; // 读取 URL 中的 ?redirect 参数
}, { immediate: true }); // 组件加载时立即执行一次

// 处理登录逻辑
function handleLogin() {
  // 调用表单验证
  proxy.$refs.loginRef.validate(valid => {
    if (valid) { // 表单验证通过
      loading.value = true; // 开启加载状态

      console.log(proxy)

      // 记住账号和密码（将密码加密后存入 Cookie，有效期 30 天）
      Cookies.set("username", loginForm.value.username, { expires: 30 });
      Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 });

      // 调用 Pinia 中的登录方法
      userStore.login(loginForm.value).then(() => {
        // 处理登录后跳转逻辑
        const query = route.query;

        console.log("query", query);

        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") { // 过滤掉 redirect 参数
            acc[cur] = query[cur];
          }
          return acc;
        }, {});

        // 跳转到 redirect 指定的页面（如果有），否则跳转到首页
        router.push({ path: redirect.value || "/", query: otherQueryParams });
      }).catch(() => {
        loading.value = false; // 失败时取消加载状态
      });
    }
  });
}

// 从 Cookie 读取已保存的用户名和密码
function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");

  // 如果 Cookie 中有保存的用户名或密码，则填充到表单
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password), // 解密密码
  };
}

// 组件加载时执行 getCookie()，自动填充登录信息
getCookie();
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
