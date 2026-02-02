<?php

namespace App\Observers;

use App\Models\Order;
use App\Services\BadgeService;

class OrderObserver
{
    public function created(Order $order): void
    {
        if ($order->status === 'completed') {
            if ($order->completed_at === null) {
                $order->completed_at = now();
                $order->saveQuietly();
            }

            $order->load('user');

            app(BadgeService::class)->checkAndUnlockBadges($order->user);
        }
    }

    public function updated(Order $order): void
    {
        $originalStatus = $order->getOriginal('status');
        $currentStatus = $order->status;

        if ($originalStatus !== 'completed' && $currentStatus === 'completed') {
            if ($order->completed_at === null) {
                $order->completed_at = now();
                $order->save();
            }

            $order->load('user');

            app(BadgeService::class)->checkAndUnlockBadges($order->user);
        }
    }
}
