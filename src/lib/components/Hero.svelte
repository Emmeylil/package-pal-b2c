<script>
    import { onMount } from "svelte";

    let formData = $state({
        name: "",
        email: "",
        phone: "",
        estimate: "",
    });

    const VOLUME_ESTIMATES = [
        "0 - 50 packages",
        "51 - 200 packages",
        "201 - 1,000 packages",
        "1,000+ packages",
    ];

    /** @type {string[]} */
    let stations = $state([]);
    let loading = $state(false);
    let submitted = $state(false);
    /** @type {string | null} */
    let error = $state(null);

    onMount(async () => {
        try {
            // Updated to use the internal API
            const res = await fetch("/api/stations");
            if (!res.ok) throw new Error("Failed to fetch stations");
            const data = await res.json();
            stations = data.map((s) => s.name);
        } catch (e) {
            console.error("Failed to fetch stations for Hero:", e);
        }
    });

    /** @param {SubmitEvent} [event] */
    async function handleSubmit(event) {
        if (event) event.preventDefault();

        console.log("Starting submission via backend...");
        const snapshot = $state.snapshot(formData);

        loading = true;
        error = null;

        try {
            // Call the new backend API instead of direct Firestore/Sheets
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(snapshot),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Submission failed");
            }

            console.log("Submission successful:", result);
            alert("Success! Your business account request has been received.");

            submitted = true;
            formData.name = "";
            formData.email = "";
            formData.phone = "";
            formData.estimate = "";
        } catch (err) {
            console.error("Error during submission: ", err);
            const errMsg =
                err instanceof Error ? err.message : "Possible network error.";
            error = "Error: " + errMsg;
            alert("Failed to send request: " + errMsg);
        } finally {
            loading = false;
        }
    }
</script>

<section class="relative bg-jumia-dark overflow-hidden">
    <div class="absolute inset-0">
        <!-- Abstract Background -->
        <img
            class="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Warehouse logistics"
        />
        <div
            class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900 to-transparent"
        ></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
            <!-- Hero Copy -->
            <div
                class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left flex flex-col justify-center"
            >
                <div
                    class="inline-flex items-center px-3 py-1 rounded-full bg-orange-900/50 border border-orange-500 text-orange-400 text-xs font-bold tracking-wider uppercase mb-6 w-max"
                >
                    For Online Sellers & Businesses
                </div>
                <h1
                    class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
                >
                    <span class="block">Scale your business</span>
                    <span class="block text-jumia-orange"
                        >with reliable logistics.</span
                    >
                </h1>
                <p class="mt-4 text-lg text-gray-300">
                    Stop worrying about delivery and focus on sales. From <strong
                        >Cash on Delivery</strong
                    >
                    to <strong>Bulk Shipping</strong>, we provide the
                    infrastructure trusted by thousands of Nigerian businesses.
                </p>

                <div
                    class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                    <div
                        class="flex items-center gap-2 text-gray-300 text-sm font-medium"
                    >
                        <svg
                            class="w-5 h-5 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            ></path></svg
                        >
                        <span>Nationwide Coverage</span>
                    </div>
                    <div
                        class="flex items-center gap-2 text-gray-300 text-sm font-medium"
                    >
                        <svg
                            class="w-5 h-5 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            ></path></svg
                        >
                        <span>Next-Day Remittance</span>
                    </div>
                    <div
                        class="flex items-center gap-2 text-gray-300 text-sm font-medium"
                    >
                        <svg
                            class="w-5 h-5 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            ></path></svg
                        >
                        <span>Real-Time Tracking</span>
                    </div>
                </div>
            </div>

            <!-- Lead Gen Form -->
            <div class="mt-12 lg:mt-0 lg:col-span-5 relative z-10">
                <div
                    class="bg-white sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden shadow-2xl"
                >
                    <div class="px-4 py-8 sm:px-10">
                        {#if submitted}
                            <div class="text-center py-12">
                                <div
                                    class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <svg
                                        class="w-8 h-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                </div>
                                <h3
                                    class="text-2xl font-bold text-gray-900 mb-2"
                                >
                                    Request Received!
                                </h3>
                                <p class="text-gray-600">
                                    Our representative will contact you shortly
                                    to complete your setup.
                                </p>
                                <button
                                    onclick={() => (submitted = false)}
                                    class="mt-6 text-jumia-orange font-bold hover:underline"
                                >
                                    Submit another request
                                </button>
                            </div>
                        {:else}
                            <div class="text-center mb-6">
                                <h3 class="text-xl font-bold text-gray-900">
                                    Get a Business Account
                                </h3>
                                <p class="text-sm text-gray-500">
                                    Sign up to view special business rates.
                                </p>
                            </div>
                            <form onsubmit={handleSubmit} class="space-y-4">
                                <div>
                                    <label for="company-name" class="sr-only"
                                        >Company Name</label
                                    >
                                    <input
                                        type="text"
                                        bind:value={formData.name}
                                        id="company-name"
                                        placeholder="Business / Store Name"
                                        required
                                        class="block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-jumia-orange focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label for="email" class="sr-only"
                                        >Work Email</label
                                    >
                                    <input
                                        type="email"
                                        bind:value={formData.email}
                                        id="email"
                                        placeholder="Email Address"
                                        required
                                        class="block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-jumia-orange focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label for="phone" class="sr-only"
                                        >Phone Number</label
                                    >
                                    <input
                                        type="tel"
                                        bind:value={formData.phone}
                                        id="phone"
                                        placeholder="Phone Number"
                                        required
                                        class="block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-jumia-orange focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label for="estimate" class="sr-only"
                                        >Monthly Packages (Estimate)</label
                                    >
                                    <select
                                        id="estimate"
                                        bind:value={formData.estimate}
                                        required
                                        class="block w-full px-4 py-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-jumia-orange focus:border-transparent"
                                    >
                                        <option value="" disabled selected
                                            >Monthly Packages (Estimate)</option
                                        >
                                        {#each VOLUME_ESTIMATES as volume}
                                            <option value={volume}
                                                >{volume}</option
                                            >
                                        {/each}
                                    </select>
                                </div>

                                {#if error}
                                    <p class="text-sm text-red-600 text-center">
                                        {error}
                                    </p>
                                {/if}

                                <div class="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-jumia-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jumia-orange transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {#if loading}
                                            <svg
                                                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                            Processing...
                                        {:else}
                                            Request Account
                                        {/if}
                                    </button>
                                </div>
                                <p
                                    class="text-xs text-center text-gray-400 mt-2"
                                >
                                    By clicking Request Account, you agree to
                                    our Terms of Service.
                                </p>
                            </form>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
