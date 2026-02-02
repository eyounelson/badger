<?php

namespace App\Listeners;

use App\Events\BadgeUnlocked;
use App\Services\CashbackService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ProcessBadgeCashback implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected CashbackService $cashbackService
    ) {}

    public function handle(BadgeUnlocked $event): void
    {
        $this->cashbackService->processCashback(
            $event->user,
            $event->badge->cashback_amount
        );
    }
}
