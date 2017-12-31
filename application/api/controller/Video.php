<?php
namespace app\api\controller;

use think\Controller;
use app\api\model\UsersInfo as UserModel;


class Video extends Controller
{
    /*public function __construct()
    {
        config("default_return_type","json");
    }*/
	public function index()
	{
		dump(config());
	}
    public function upload_url()
    {
        $post_info = request()->post();
        /**以下新增 */
        $teacher = UserModel::get($post_info['id']);
        if($teacher == null || $teacher->role == 'student'){
            return abort(200, 'user does not exist or is not a teacher');
        }
        /**以上新增 */

        /** 首先从百家云获取video_id和upload_url
         *  因为更新数据库的时候需要用到video_id
         */
        $parm = [
            'partner_id' => Funcs::$partner_id,
            'file_name' => $post_info['file_name'],
            'definition' => $post_info['definition'],
            'timestamp' => time(),
        ];
        $sign = Funcs::getSign($parm);
        $parm['sign'] = $sign;
        $result_str = Funcs::send_post('https://api.baijiayun.com/openapi/video/getUploadUrl', $parm); //$result_str存的是string类型的
        //dump($result_str);
        if($result_str == null){
            return abort(200, 'request remote api error');
        }
        $result_json = json_decode($result_str, true);
        if($result_json['code'] != 0){
            return abort(200, $result_json['msg'].'[code]:' . $result_json['code']);
        }
        //dump($result_json);
        $result_data = $result_json['data'];
        /**然后更新数据库 */
        $teacher->myCreatedVideos()->save([
            'video_id'  => $result_data['video_id'],
            'name'  => $post_info['file_name'],
            'create_time'=>time(),
            'introduction'  =>$post_info['introduction'],
            'owner_id'  =>$post_info['id'],
            'status' => 10  //status=10表示上传中
        ]);
        /**返回给前端的时候只用把百家云返回的数据直接按json格式返回给前端就可以了 */
        return json($result_json);
    }
    
    public function resume_upload_url()
    {
        $post_info = request()->post();
        $parm = [
            'partner_id' => Funcs::$partner_id,
            'video_id' => $post_info['video_id'],
            'timestamp' => time(),
        ];
        $sign = Funcs::getSign($parm);
        $parm['sign'] = $sign;
        
        $result_str = Funcs::send_post('https://api.baijiayun.com/openapi/video/getResumeUploadUrl', $parm); //$result_str存的是string类型的
        if($result_str == null){
            return abort(200, 'request remote api error');
        }
        
        $result_json = json_decode($result_str, true);
        if($result_json['code'] != 0){
            return abort(200, $result_json['msg'].'[code]:' . $result_json['code']);
        }
        return json($result_json);
    }

    /*
        下面的函数都是编写的时候测试用的，到时候可以删掉
     */
    public function test_post()
    {
        $post_info = request()->post();
        dump($post_info);
    }

    public function get_token($id)
    {
        $parm = [
            'partner_id' => Funcs::$partner_id,
            'video_id' => $id,
            'expires_in' => 0,
            'timestamp' => time(),
        ];
        $sign = Funcs::getSign($parm);
        $parm['sign'] = $sign;
        $result_str = Funcs::send_post('https://api.baijiayun.com/openapi/video/getPlayerToken', $parm); //$result_str存的是string类型的
        if($result_str == null){
            return abort(200, 'request remote api error');
        }
        
        $result_json = json_decode($result_str, true);
        if($result_json['code'] != 0){
            return abort(200, $result_json['msg'].'[code]:' . $result_json['code']);
        }
        return json($result_json);
    }

    public function get_info($id)
    {
        $parm = [
            'partner_id' => Funcs::$partner_id,
            'video_id' => $id,
            //'expires_in' => 0,
            'timestamp' => time(),
        ];
        $sign = Funcs::getSign($parm);
        $parm['sign'] = $sign;
        $result_str = Funcs::send_post('https://api.baijiayun.com/openapi/video/getInfo', $parm); //$result_str存的是string类型的
        if($result_str == null){
            return abort(200, 'request remote api error');
        }
        
        $result_json = json_decode($result_str, true);
        if($result_json['code'] != 0){
            return abort(200, $result_json['msg'].'[code]:' . $result_json['code']);
        }
        return json($result_json);
    }
}


?>