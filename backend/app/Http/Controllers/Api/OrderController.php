<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function store(CreateOrderRequest $request): JsonResponse
    {
        Order::create([
            'user_id' => $request->user()->id,
            'total_amount' => $request->validated('amount'),
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Order completed',
        ], 201);
    }
}
