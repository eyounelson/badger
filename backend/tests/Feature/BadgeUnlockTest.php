<?php

namespace Tests\Feature;

use App\Events\BadgeUnlocked;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BadgeUnlockTest extends TestCase
{
    use RefreshDatabase;

    public function test_multiple_badges_unlocks(): void
    {
        Event::fake([BadgeUnlocked::class]);

        $user = User::factory()->create();

        Order::factory()->count(10)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $user = $user->fresh();

        $this->assertCount(6, $user->badges);
        $this->assertTrue($user->badges->contains('name', 'First Purchase'));
        $this->assertTrue($user->badges->contains('name', 'Early Adopter'));
        $this->assertTrue($user->badges->contains('name', 'Loyal Customer'));

        Event::assertDispatched(BadgeUnlocked::class, 6);
    }

    public function test_previously_unlocked_badges_dont_unlock_again(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(2)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $user->refresh()->load('badges');
        $initialBadgeCount = $user->badges->count();

        Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $user->refresh()->load('badges');

        $this->assertEquals($initialBadgeCount, $user->badges->count());
    }
}
