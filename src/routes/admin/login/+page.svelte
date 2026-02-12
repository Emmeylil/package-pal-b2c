<script>
    import { auth } from "$lib/firebase";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { goto } from "$app/navigation";
    import { user } from "$lib/authStore";
    import { onMount } from "svelte";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    // If already logged in, redirect to admin
    onMount(() => {
        const unsubscribe = user.subscribe((u) => {
            if (u) {
                goto("/admin");
            }
        });
        return unsubscribe;
    });

    async function handleLogin() {
        loading = true;
        error = "";
        try {
            await signInWithEmailAndPassword(auth, email, password);
            goto("/admin");
        } catch (err) {
            console.error("Login error:", err);
            error = "Invalid email or password. Please try again.";
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Admin Login | Package Pal B2B</title>
</svelte:head>

<div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
>
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Portal
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Sign in to access business leads
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
            class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100"
        >
            <form class="space-y-6" on:submit|preventDefault={handleLogin}>
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700"
                    >
                        Email address
                    </label>
                    <div class="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            bind:value={email}
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-jumia-orange focus:border-jumia-orange sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <div class="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            bind:value={password}
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-jumia-orange focus:border-jumia-orange sm:text-sm"
                        />
                    </div>
                </div>

                {#if error}
                    <div class="rounded-md bg-red-50 p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg
                                    class="h-5 w-5 text-red-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                {/if}

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-jumia-orange hover:bg-[#e07b1d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jumia-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {#if loading}
                            <svg
                                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Signing in...
                        {:else}
                            Sign in
                        {/if}
                    </button>
                </div>
            </form>

            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">
                            Internal use only
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4 text-center">
            <a href="/" class="text-xs text-gray-400 hover:text-gray-600">
                &larr; Back to main site
            </a>
        </div>
    </div>
</div>

<style>
    .bg-jumia-orange {
        background-color: #f68b1e;
    }
    .focus\:ring-jumia-orange:focus {
        --tw-ring-color: #f68b1e;
    }
    .focus\:border-jumia-orange:focus {
        border-color: #f68b1e;
    }
</style>
