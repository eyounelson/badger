<?php

namespace Tests\Feature;

use App\Events\BadgeUnlocked;
use App\Listeners\ProcessBadgeCashback;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class CashbackTest extends TestCase
{
    use RefreshDatabase;

    public function test_badge_unlocked_event_triggers_process_badge_cashback_listener(): void
    {
        Event::fake([BadgeUnlocked::class]);

        $user = User::factory()->create();

        Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        Event::assertDispatched(BadgeUnlocked::class);
        Event::assertListening(BadgeUnlocked::class, ProcessBadgeCashback::class);
    }

    public function test_multiple_badge_unlocks_trigger_multiple_cashback_payments(): void
    {
        Event::fake([BadgeUnlocked::class]);

        $user = User::factory()->create();

        Order::factory()->count(4)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        Event::assertDispatched(BadgeUnlocked::class, 3);
    }
}
