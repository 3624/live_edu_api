<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 17/12/08
 * Time: 11:10
 */

namespace app\api\controller;
use app\api\model\Slides as SlidesModel;
use think\Controller;

class Slides extends Controller{
    function add_slide(){
        $post_info = $this->request->post();
        $file = $this->request->file('image');
        $result = $this->validate(['file' => $file], ['file'=>'require|image'],
            ['file.require' => 'choose image file', 'file.image' => 'not an image']);
        if(true !== $result){
            return abort(200, $result);
        }else{
            $info = $file->rule('md5')->move(ROOT_PATH . 'public' . DS . 'static'.DS.'slides');
            if($info){
                $new_slide = new SlidesModel;
                $new_slide->title = $post_info['title'];
                $new_slide->video_link = $post_info['link'];
                $new_slide->img_path = $info->getRealPath();
                $new_slide->img_url = $this->request->root(true) . '/static/slides/' . $info->getSaveName();
                if($new_slide->save()){
                    $data = [
                        'id' => $new_slide->id,
                        'title' => $new_slide->title,
                        'imgurl' => $new_slide->img_url,
                        'videolink' => $new_slide->video_link];
                    return json(Funcs::rtnFormat($data));
                }else{
                    return abort(200, $new_slide->getError());
                }
            }else{
                return abort(200, $info->getError());
            }
        }
    }

    function get_slide(){
        //dump('test');
        $all_slides = SlidesModel::all();
        if(count($all_slides) != 0){
            $imgs = array();
            foreach ($all_slides as $slide){
                $slide->hidden(['id', 'img_path'])->toArray();
                $imgs[] = $slide;
            }
            $data = ['number' => count($all_slides), 'imgs' => $imgs];
            return json(Funcs::rtnFormat($data));
        }else{
            return abort(200, 'no data');
        }
    }
}