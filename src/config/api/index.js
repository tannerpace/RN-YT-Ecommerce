import axios from 'axios';

const BASE_URL = 'http://192.168.100.12/apis/GTPOnlineShop/';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
});

export const SIGN_IN = 'sign_in.php';
export const CREATE_SHOP = 'create_shop.php';
export const GET_NEARBY_SHOPS = 'get_nearby_shops.php';
