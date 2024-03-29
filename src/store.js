import {reactive} from 'vue'

export const store = reactive({
    user: null,
    token: null,
    errorTexts: [],
    successTexts: [],
    confirmModal: {
        show: false,
        title: '',
        content: '',
        onConfirm: ()=> {}
    },

    displayError(text) {
        this.errorTexts.push(text)
        // after 3 seconds, remove the error
        setTimeout(() => {
            this.errorTexts.shift()
        }, 3000)
    },
    displaySuccess(text) {
        this.successTexts.push(text)
        // after 3 seconds, remove the error
        setTimeout(() => {
            this.successTexts.shift()
        }, 3000)
    },
    isLoggedIn() {
        return this.user != null
    },
    isAdmin() {
        return this.user != null && this.user.roles.includes('ROLE_ADMIN')
    },
    reset() {
        this.user = null
        this.token = null
    }
})
