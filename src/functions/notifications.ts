import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
    autoClose: 6000,
    draggable: false
});

export const successNotification = (msg: string) => toast.success(msg);
export const errorNotification = (msg: string) => toast.error(msg);
export const infoNotification = (msg: string) => toast.info(msg);
export const warnNotification = (msg: string) => toast.warn(msg);