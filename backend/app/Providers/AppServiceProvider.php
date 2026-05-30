<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (\OpenApi\Analysers\DocBlockParser::isEnabled()
            && $this->app->runningInConsole()
            && in_array('l5-swagger:generate', $_SERVER['argv'] ?? [], true)) {
            config([
                'l5-swagger.defaults.scanOptions.analyser' => new \OpenApi\Analysers\ReflectionAnalyser([
                    new \OpenApi\Analysers\AttributeAnnotationFactory(),
                    new \OpenApi\Analysers\DocBlockAnnotationFactory(),
                ]),
            ]);
        }

        if ($this->app->environment('production')) {
            URL::forceScheme('https');

            if (config('app.debug')) {
                Log::warning('SECURITY WARNING: APP_DEBUG is enabled in production environment.');
            }
        }
    }
}
