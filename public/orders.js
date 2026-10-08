const API_URL = '/api/orders';

// Select page element handlers
const orderForm = document.getElementById('order-form');
const refreshBtn = document.getElementById('refresh-btn');
const timestampEl = document.getElementById('timestamp');
const tableBody = document.getElementById('orders-table-body');
const alertContainer = document.getElementById('alert-container');

/**
 * 1. GET Request: Pull data rows and format them downward under the columns
 */
async function fetchOrders() {
    try {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Loading orders...</td></tr>`;

        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Failed to retrieve records');
        }

        const orders = result.data;

        // Set the dynamic live timestamp string matching your classroom slides
        const now = new Date();
        timestampEl.textContent = `Updated: ${now.toString()}`;

        if (!orders || orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No orders currently active.</td></tr>`;
            return;
        }

        // Output fields horizontally with calculations mapping directly down the rows
        tableBody.innerHTML = orders.map(order => {
            const quantity = parseInt(order.quantity) || 0;
            const unitCost = parseFloat(order.unitCost) || 0.00;

            return `
                <tr>
                    <td><strong>#${order.orderID}</strong></td>
                    <td class="text-wrap">${escapeHTML(order.orderDesc)}</td>
                    <td class="text-end">${quantity}</td>
                    <td class="text-end">$${unitCost.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Fetch error:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-3"> Error: ${error.message}</td></tr>`;
        timestampEl.textContent = 'Update tracking failed';
    }
}

/**
 * 2. POST Request: Submit new input values seamlessly into your database layout
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // Stop standard hard reloading loops

    const orderDesc = document.getElementById('orderDesc').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderDesc, quantity, unitCost }) // Match schema structure exactly
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showAlert('Order entry added to system successfully!', 'success');
            orderForm.reset(); // Clear input elements
            fetchOrders();     // Reload data matrix seamlessly
        } else {
            throw new Error(result.error || 'API execution context failure');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showAlert(error.message, 'danger');
    }
}

/**
 * Utility Function: Display status feedback banners on screen safely
 */
function showAlert(message, type) {
    if (!alertContainer) return;
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show p-2 small mb-3" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="padding: 0.75rem;"></button>
        </div>
    `;
    setTimeout(() => { alertContainer.innerHTML = ''; }, 4000);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// Attach event hooks
if (orderForm) orderForm.addEventListener('submit', handleFormSubmit);
if (refreshBtn) refreshBtn.addEventListener('click', fetchOrders);
document.addEventListener('DOMContentLoaded', fetchOrders);
