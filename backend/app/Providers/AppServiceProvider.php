<?php

namespace App\Providers;

use App\Events\BadgeUnlocked;
use App\Listeners\ProcessBadgeCashback;
use App\Models\Order;
use App\Observers\OrderObserver;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Event::listen(
            BadgeUnlocked::class,
            ProcessBadgeCashback::class
        );

        Order::observe(OrderObserver::class);
    }
}
