<?php
namespace app\api\controller;

use think\Controller;


class Index extends Controller
{
    public function index()
    {
    	dump("in api/index/index");
        //Funcs::myAbort(404, 'test error');
    }
}