<?php

namespace Tests\Feature;

use App\Events\BadgeUnlocked;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class OrderCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_creation_triggers_badge_unlock_and_fires_event(): void
    {
        Event::fake([BadgeUnlocked::class]);

        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/orders', [
            'amount' => 5000,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Order completed',
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_amount' => 5000,
            'status' => 'completed',
        ]);

        $user->refresh();
        $this->assertCount(1, $user->badges);
        $this->assertEquals('First Purchase', $user->badges->first()->name);

        Event::assertDispatched(BadgeUnlocked::class, function ($event) use ($user) {
            return $event->user->id === $user->id
                && $event->badge->name === 'First Purchase';
        });
    }
}
