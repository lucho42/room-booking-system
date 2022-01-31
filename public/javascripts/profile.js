window.addEventListener('DOMContentLoaded', () => {
    const formProfileAvatar = document.querySelector('#form-profile-avatar')
    const inputAvatar = document.querySelector('#input-avatar')

    formProfileAvatar.addEventListener('click', () => {
        inputAvatar.click()
    })
    inputAvatar.addEventListener('change', () => {
        formProfileAvatar.submit()
    })
})
