<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TotalSalesController;
use App\Http\Controllers\Api\TotalRevenueController;
use App\Http\Controllers\Api\TotalRevenueBreakdownController;
use App\Http\Controllers\Api\SalesByProductController;
use App\Http\Controllers\Api\RevenueBySegmentController;
use App\Http\Controllers\Api\SalesCycleLengthController;
use App\Http\Controllers\Api\CustomerLifetimeValueController;
use App\Http\Controllers\Api\SalesAdequacyRatioController;
use App\Http\Controllers\Api\SalesConversionRatioController;
use App\Http\Controllers\Api\SalesVsScalingRevenueController;
use App\Http\Controllers\Api\OrderComplianceController;
use App\Http\Controllers\Api\ChurnRateController;
use App\Http\Controllers\Api\FilterController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/kpi/total-sales', [TotalSalesController::class, 'index']);
Route::get('/kpi/total-revenue', [TotalRevenueController::class, 'index']);
Route::get('/kpi/total-revenue-breakdown', [TotalRevenueBreakdownController::class, 'index']);
Route::get('/kpi/sales-by-product', [SalesByProductController::class, 'index']);
Route::get('/kpi/revenue-by-segment', [RevenueBySegmentController::class, 'index']);
Route::get('/kpi/sales-cycle-length', [SalesCycleLengthController::class, 'index']);
Route::get('/kpi/customer-lifetime-value', [CustomerLifetimeValueController::class, 'index']);
Route::get('/kpi/sales-adequacy-ratio', [SalesAdequacyRatioController::class, 'index']);
Route::get('/kpi/sales-conversion-ratio', [SalesConversionRatioController::class, 'index']);
Route::get('/kpi/sales-vs-scaling-revenue', [SalesVsScalingRevenueController::class, 'index']);
Route::get('/kpi/order-compliance', [OrderComplianceController::class, 'index']);
Route::get('/kpi/churn-rate', [ChurnRateController::class, 'index']);


Route::get('/filter/years', [FilterController::class, 'getYears']);
Route::get('/filter/months', [FilterController::class, 'getMonths']);









