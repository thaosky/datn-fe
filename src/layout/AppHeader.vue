<template>
  <header class="header-global">
    <div class="main menu"
         style="background: #F2F2F2;; width: 100%; height: 68px; box-shadow: -10px -10px 10px rgba(189, 189, 189, 0.2), 6px 6px 10px rgba(189, 189, 189, 0.2); position: fixed; top: 0; z-index: 200">
      <div class="container-fluid">
        <div class="row">
          <div class="col-3 _col-1 position-r">
            <div class="logo-menu vertical-center">
              <router-link to="/tests">
                <img src="img/theme/quizchii_white.png" class="w-100 logo-pc">
              </router-link>
              <a class="open-loading" href="https://learn.mochidemy.com">
                <img src="img/theme/mochi_new.png" class="w-100 logo-small">
              </a>
            </div>
          </div>
          <div class="col-6 _col-2">
            <div v-if="store.isAdmin()" class="row menu">
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('tests')}">
                <router-link to="/tests">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/quiz.png" alt="">
                    <p class="mb-0">
                      Quiz
                    </p>
                  </div>
                </router-link>
              </div>
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('questions')}">
                <router-link to="/questions">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/community.png" alt="">
                    <p class="mb-0">
                      Câu hỏi
                    </p>
                  </div>
                </router-link>
              </div>
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('tags')}">
                <router-link to="/tags">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/book.png" alt="">
                    <p class="mb-0">
                      Tag
                    </p>
                  </div>
                </router-link>
              </div>
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('statistics')}">
                <router-link to="/statistics">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/analysis.png" alt="">
                    <p class="mb-0">
                      Thống kê
                    </p>
                  </div>
                </router-link>
              </div>
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('users')}">
                <router-link to="/users">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/profile_active.png" alt="">
                    <p class="mb-0">
                      Tài khoản
                    </p>
                  </div>
                </router-link>
              </div>
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('achievements')}">
                <router-link to="/achievements">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/achievement.png" alt="">
                    <p class="mb-0">
                      Thành tựu
                    </p>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-else-if="store.isLoggedIn()" class="row menu">
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('tests')}">
                <router-link to="/tests">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/quiz.png" alt="">
                    <p class="mb-0">
                      Quiz
                    </p>
                  </div>
                </router-link>
              </div>
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('statistics')}">
                <router-link to="/statistics/my-results">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/analysis.png" alt="">
                    <p class="mb-0">
                      Lịch sử làm bài
                    </p>
                  </div>
                </router-link>
              </div>
              <div class="col p-0 text-center menu-item" :class="{active: $route.path.includes('achievements')}">
                <router-link to="/achievements">
                  <div class="menu-item-box text-center w-100 text-dark">
                    <img src="img/theme/achievement.png" alt="">
                    <p class="mb-0">
                      Thành tựu
                    </p>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-else style="height: 68px"></div>
          </div>
          <div class="col-3 _col-3 position-r">
            <div class="d-flex justify-content-end align-items-center" style="gap: 10px">
              <div class="menu-user-name">
                <span v-if="store.isLoggedIn()" class="text-user-name" style="color: #FFCB08">
                  {{ store.user.name }}
                </span>
                <span class="text-user-name" style="color: #FFCB08" v-else>
                  Guest
                </span>
              </div>
              <div class="menu-avatar"
                   style="background: url(img/theme/avatar.png); background-size: cover;">
              </div>
              <div :class="showDropDown ? 'icon-menu-dropdown-open' : 'icon-menu-dropdown-close'"
                   @click="showDropDown = !showDropDown"
              >
                <img src="img/theme/dropdown_menu.svg">
              </div>
            </div>
          </div>
          <div v-show="showDropDown" class="position-a menu-dropdown text-center">
            <template v-if="store.isLoggedIn()">
              <router-link to="/users/profile" class="btn-setting">
                <div class="btn-top text-start btn-active menu-dropdown-item" @click="showDropDown = false">
                  <span class="p-dropdown vertical-center">
                    Cài đặt tài khoản
                  </span>
                  <img src="img/theme/setting.png" alt="">
                </div>
              </router-link>
              <router-link to="/users/profile/change-password" class="btn-setting">
                <div class="btn-top text-start btn-active menu-dropdown-item" @click="showDropDown = false">
                  <span class="p-dropdown vertical-center">
                    Đổi mật khẩu
                  </span>
                  <img src="https://cdn-icons-png.flaticon.com/512/891/891399.png" alt="">
                </div>
              </router-link>
              <router-link v-if="store.isAdmin()" to="/statistics/my-results" class="btn-setting">
                <div class="btn-top text-start btn-active menu-dropdown-item" @click="showDropDown = false">
                  <span class="p-dropdown vertical-center">
                    Lịch sử làm bài
                  </span>
                  <img src="img/theme/cup.png" alt="">
                </div>
              </router-link>
              <a href="javascript:" class="btn-setting"
                 style="margin-bottom: 30px">
                <div class="btn-top text-start btn-active menu-dropdown-item" @click="logout">
                  <span class="p-dropdown vertical-center">
                    Đăng xuất
                  </span>
                  <img src="https://cdn-icons-png.flaticon.com/512/3580/3580154.png" alt="">
                </div>
              </a>
            </template>
            <template v-else>
              <a href="javascript:" class="btn-setting"
                 style="margin-bottom: 30px">
                <div class="btn-top-setting text-start btn-active menu-dropdown-item" @click="login">
                <span class="text-white p-dropdown vertical-center">
                  Đăng nhập
                </span>
                  <img src="https://cdn.icon-icons.com/icons2/2248/PNG/512/login_icon_137429.png" alt="">
                </div>
              </a>
            </template>
          </div>
        </div>
        <div class="message-container">
          <template v-for="error in store.errorTexts">
            <base-alert type="danger" icon="ni ni-support-16">
              <span slot="text"><strong>Error!</strong> {{ error }}</span>
            </base-alert>
          </template>
          <template v-for="success in store.successTexts">
            <base-alert type="success" icon="ni ni-support-16">
              <span slot="text"><strong>Success!</strong> {{ success }}</span>
            </base-alert>
          </template>
        </div>
        <modal :show.sync="store.confirmModal.show">
          <h5 slot="header" class="modal-title" id="modal-title-default">{{store.confirmModal.title}}</h5>

          <p>{{store.confirmModal.content}}</p>

          <template slot="footer" style="flex-direction: row-reverse; justify-content: flex-start">
            <base-button type="success" @click="confirmAndClose">Confirm</base-button>
            <base-button type="link" @click="store.confirmModal.show = false">
              Cancel
            </base-button>
          </template>
        </modal>
      </div>
    </div>
  </header>
</template>
<script>
import {store} from "@/store";
import Modal from "@/components/Modal.vue";

export default {
  name: "AppHeader",
  components: {Modal},
  data() {
    return {
      store,
      showDropDown: false,
    };
  },
  computed: {
    confirmAndClose() {
      return () => {
        store.confirmModal.onConfirm();
        setTimeout(() => {
          store.confirmModal.show = false;
        }, 0);
      };
    },
  },
  methods: {
    logout() {
      store.reset();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expired');
      this.$router.push('/');
    },
    login() {
      this.$router.push('/login');
    },
  },
  created() {
    const expired = localStorage.getItem('expired');
    if (expired && expired < Date.now()) {
      store.displayError('Phiên đăng nhập đã hết hạn');
      this.logout();
    } else if (localStorage.getItem('user')) {
      store.user = JSON.parse(localStorage.getItem('user'));
      store.token = localStorage.getItem('token');
    } else {
      store.user = null;
      store.token = null;
    }
  },
};
</script>
<style>
</style>
