<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { auth } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { user, authLoading } from "$lib/authStore";

    /** @type {any} */
    export let data;
    const { leads, error } = data;

    onMount(() => {
        const unsubscribe = user.subscribe((u) => {
            if (!$authLoading && !u) {
                goto("/admin/login");
            }
        });
        return unsubscribe;
    });

    async function handleLogout() {
        try {
            await signOut(auth);
            goto("/admin/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    }

    /**
     * @param {string} id
     * @param {boolean} contacted
     */
    async function toggleContacted(id, contacted) {
        // Optimistic update
        /** @type {any[]} */
        const leadsData = leads;
        const leadIndex = leadsData.findIndex((l) => l.id === id);
        if (leadIndex !== -1) {
            leadsData[leadIndex].contacted = contacted;
        }

        try {
            const response = await fetch("/admin/api/toggle-contacted", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, contacted }),
            });
            if (!response.ok) throw new Error("Failed to update");
        } catch (err) {
            console.error("Error toggling contacted:", err);
            // Revert on error
            if (leadIndex !== -1) {
                leadsData[leadIndex].contacted = !contacted;
            }
        }
    }

    /**
     * @param {string | null | undefined} dateStr
     */
    function formatDate(dateStr) {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleString("en-NG", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return dateStr;
        }
    }
</script>

<svelte:head>
    <title>Admin Dashboard | Package Pal B2B</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-12">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="md:flex md:items-center md:justify-between">
                <div class="flex-1 min-w-0">
                    <h1
                        class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
                    >
                        Business Leads Dashboard
                    </h1>
                    <p class="mt-1 text-sm text-gray-500">
                        Total Submissions: <span
                            class="font-semibold text-jumia-orange"
                            >{leads.length}</span
                        >
                    </p>
                </div>
                <div class="mt-4 flex space-x-3 md:mt-0 md:ml-4">
                    <a
                        href="/"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jumia-orange transition-all"
                    >
                        View Site
                    </a>
                    <button
                        on:click={handleLogout}
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-jumia-dark hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jumia-dark transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {#if error}
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
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

        <div
            class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200"
        >
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 text-sm">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                class="px-6 py-4 text-left font-semibold text-gray-900 uppercase tracking-wider"
                            >
                                Business Name
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-4 text-left font-semibold text-gray-900 uppercase tracking-wider"
                            >
                                Contact Info
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-4 text-left font-semibold text-gray-900 uppercase tracking-wider"
                            >
                                Monthly Estimate
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-4 text-left font-semibold text-gray-900 uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-4 text-left font-semibold text-gray-900 uppercase tracking-wider"
                            >
                                Submitted At
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#each leads as lead}
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="font-medium text-gray-900">
                                        {lead["Business Name"] || "N/A"}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        ID: {lead.id.slice(0, 8)}...
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-gray-900">
                                        {lead["Email Address"] || lead.email}
                                    </div>
                                    <div class="text-gray-500">
                                        {lead["Phone Number"] || lead.phone}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-jumia-orange"
                                    >
                                        {lead["Monthly Estimate"] ||
                                            "Not provided"}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div
                                        class="relative inline-block text-left"
                                    >
                                        <select
                                            value={lead.contacted
                                                ? "contacted"
                                                : "pending"}
                                            on:change={(e) => {
                                                const target =
                                                    /** @type {HTMLSelectElement} */ (
                                                        e.target
                                                    );
                                                toggleContacted(
                                                    lead.id,
                                                    target.value ===
                                                        "contacted",
                                                );
                                            }}
                                            class="block w-full pl-3 pr-8 py-1 text-xs font-semibold rounded-full border focus:outline-none focus:ring-1 focus:ring-jumia-orange transition-all cursor-pointer appearance-none
                                                {lead.contacted
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}"
                                        >
                                            <option value="pending"
                                                >Pending</option
                                            >
                                            <option value="contacted"
                                                >Contacted</option
                                            >
                                        </select>
                                        <!-- Custom Chevron for cleaner look -->
                                        <div
                                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                                        >
                                            <svg
                                                class="h-3 w-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="3"
                                                    d="M19 9l-7 7-7-7"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-gray-500"
                                >
                                    {formatDate(lead.SubmittedAt)}
                                </td>
                            </tr>
                        {:else}
                            <tr>
                                <td
                                    colspan="4"
                                    class="px-6 py-12 text-center text-gray-500 italic"
                                >
                                    No leads found in the system.
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<style>
    /* Custom styles for the table if needed */
    .text-jumia-orange {
        color: #f68b1e;
    }
    .bg-orange-100 {
        background-color: #fff7ed;
    }
</style>
