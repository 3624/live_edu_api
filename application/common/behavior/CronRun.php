<?php
/**
 * Created by PhpStorm.
 * User: BobCheng
 * Date: 2017/12/27
 * Time: 23:37
 */

namespace app\common\behavior;


class CronRun
{
    public function run(){
        $host_name = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : "*";
        header("Access-Control-Allow-Origin: $host_name");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: x-token,x-uid,x-token-check,x-requested-with,content-type,Host");
        if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit;
        }
    }
}