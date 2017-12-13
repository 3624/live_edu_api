<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/12
 * Time: 23:39
 */

namespace app\api\controller;


class Funcs{
    static $partner_key = 'XwDMeBpviq4VclGbGfTk9ACZq4z+c8aICRE9p4dbo+VGglzvQp4cpMju5tc2PnMBH6QrTXNcdEXnaIsi0HO2ZA==';
    static $partner_id = 37421328;

    public static function rtnFormat($data, $code=200, $status=true){
        $rtn = ['code' => $code,
            'status' => $status,
        ];
        if($data != null){
            $rtn['data'] = $data;
        }

        return $rtn;
    }

    public static function getSign($params) {
        ksort($params);//将参数按key进行排序
        $str = '';
        foreach ($params as $k => $val) {
            $str .= "{$k}={$val}&"; //拼接成 key1=value1&key2=value2&...&keyN=valueN& 的形式
        }
        $str .= "partner_key=" . Funcs::$partner_key; //结尾再拼上 partner_key=$partner_key
        $sign = md5($str); //计算md5值
        return $sign;
    }

    public static function send_post($url, $post_data) {

        $postdata = http_build_query($post_data);
        $options = array(
            'http' => array(
                'method' => 'POST',
                'header' => 'Content-type:application/x-www-form-urlencoded',
                'content' => $postdata,
                'timeout' => 15 * 60 // 超时时间（单位:s）
            )
        );
        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        return $result;
    }
}