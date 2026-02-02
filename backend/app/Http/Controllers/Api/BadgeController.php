<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BadgeResource;
use App\Http\Resources\UserAchievementsResource;
use App\Models\Badge;
use App\Models\User;
use App\Services\BadgeService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BadgeController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return BadgeResource::collection(
            Badge::orderBy('required_purchases')->get()
        );
    }

    public function show(User $user, BadgeService $badgeService): UserAchievementsResource
    {
        return new UserAchievementsResource($user, $badgeService);
    }
}
