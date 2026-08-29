<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $users = $this->userService->paginate($request->user(), $request->all());

        return ApiResponse::paginated($users, UserResource::class);
    }

    public function dentists(Request $request): JsonResponse
    {
        return ApiResponse::success(
            UserResource::collection($this->userService->dentists($request->user()))->resolve()
        );
    }

    public function show(Request $request, int $user): JsonResponse
    {
        return ApiResponse::success(
            new UserResource($this->userService->get($request->user(), $user))
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $created = $this->userService->create($request->user(), $request->validated());

        return ApiResponse::success(new UserResource($created), 'Membre ajouté.', 201);
    }

    public function update(UpdateUserRequest $request, int $user): JsonResponse
    {
        $existing = $this->userService->get($request->user(), $user);
        $this->userService->assertNotLastAdmin($existing, $request->validated('role'));
        $updated = $this->userService->update($request->user(), $user, $request->validated());

        return ApiResponse::success(new UserResource($updated), 'Membre mis à jour.');
    }
}
