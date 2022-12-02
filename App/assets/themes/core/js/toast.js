async function toast(color, message) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    toast.color = color;

    document.body.appendChild(toast);
    return toast.present();
}