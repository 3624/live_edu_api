<?php
namespace app\api\exception;
use think\exception\Handle;
use think\exception\HttpException;
class Http extends Handle
{
    public function render(\Exception $e)
    {
        if ($e instanceof HttpException) {
            $statusCode = $e->getStatusCode();
        }
        if (!isset($statusCode)) {
            $statusCode = 500;
        }
        $result = [
            'code' => $statusCode,
            'status' => false,
            'error' => $e->getMessage(),
        ];
        return json($result, $statusCode);
    }
}