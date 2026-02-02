<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
{
    public function __construct($resource, protected string $token)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        return [
            'token' => $this->token,
            'user' => [
                'id' => $this->resource->id,
                'name' => $this->resource->name,
                'email' => $this->resource->email,
            ],
        ];
    }
}
