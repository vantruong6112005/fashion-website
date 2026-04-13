import codIcon from "../assets/images/icon/cod.png";
import momoIcon from "../assets/images/icon/momo.png";
import zalopayIcon from "../assets/images/icon/zalopay.png";
import vnpayIcon from "../assets/images/icon/vnpay.svg";

export const PAYMENT_METHODS = [
  {
    value: "COD",
    label: "Thanh toán khi nhận hàng",
    description: "Thanh toán bằng tiền mặt tại thời điểm nhận hàng",
    icon: codIcon,
    enabled: true,
  },
  {
    value: "MOMO",
    label: "Ví MoMo",
    description: "Quét QR hoặc mở app MoMo để hoàn tất thanh toán",
    icon: momoIcon,
    enabled: true,
  },
  {
    value: "ZALOPAY",
    label: "ZaloPay",
    description: "Hiển thị giao diện, chưa mở thanh toán thực tế",
    icon: zalopayIcon,
    enabled: false,
  },
  {
    value: "VNPAY",
    label: "Ví điện tử VNPAY",
    description: "Hiển thị giao diện, chưa mở thanh toán thực tế",
    icon: vnpayIcon,
    enabled: false,
  },
];
