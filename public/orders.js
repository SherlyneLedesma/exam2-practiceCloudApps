const API_URL = '/api/orders';

const orderForm = document.getElementById('order-form');
const refreshBtn = document.getElementById('refresh-btn');
const timestampEl = document.getElementById('timestamp');
const tableBody = document.getElementById('orders-table-body');

let currentEditId = null;

/**
 * READ ALL: Fetch orders from the server and display them underneath headers
 */
async function fetchOrders() {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Loading orders...</td></tr>`;

    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        const orders = result.data;
        
        const now = new Date();
        timestampEl.textContent = `Updated: ${now.toLocaleTimeString()}`;

        tableBody.innerHTML = '';

        if (!orders || orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No orders found.</td></tr>`;
            return;
        }

        // Loop through each order and stack columns downward matching the layout fields
        orders.forEach(order => {
            const quantity = parseInt(order.quantity) || 0;
            const unitCost = parseFloat(order.unitCost) || 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="ps-3"><strong>#${order.orderID}</strong></td>
                <td>${order.orderDesc}</td>
                <td class="text-end">${quantity}</td>
                <td class="text-end">$${unitCost.toFixed(2)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning" id="edit-${order.orderID}">Edit</button>
                    <button class="btn btn-sm btn-danger" id="delete-${order.orderID}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);

            // Button actions setup hooks
            document.getElementById(`edit-${order.orderID}`).addEventListener('click', () => populateFormForEdit(order));
            document.getElementById(`delete-${order.orderID}`).addEventListener('click', () => executeDelete(order.orderID));
        });

    } catch (error) {
        console.error('Fetch error:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading data.</td></tr>`;
    }
}

/**
 * FORM SUBMISSION: Handles both saving a NEW order (POST) or UPDATING an old one (PUT)
 */
orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const orderData = {
        orderDesc: document.getElementById('orderDesc').value.trim(),
        quantity: parseInt(document.getElementById('quantity').value, 10),
        unitCost: parseFloat(document.getElementById('unitCost').value)
    };

    try {
        if (currentEditId === null) {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            alert('Order added successfully!');
        } else {
            await fetch(`${API_URL}/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            alert('Order updated successfully!');
        }

        resetForm();
        fetchOrders();

    } catch (error) {
        console.error('Save error:', error);
        alert('An error occurred while saving.');
    }
});

/**
 * EDIT SETUP: Populates row values back up into input fields
 */
function populateFormForEdit(order) {
    document.getElementById('orderDesc').value = order.orderDesc;
    document.getElementById('quantity').value = order.quantity;
    document.getElementById('unitCost').value = order.unitCost;

    currentEditId = order.orderID;

    const submitBtn = orderForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Order';
    submitBtn.className = 'btn btn-warning w-100 py-2 fw-bold text-uppercase mt-2';
}

/**
 * DELETE: Remove order completely from tracking
 */
async function executeDelete(id) {
    if (!confirm(`Are you sure you want to delete order #${id}?`)) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        alert('Order deleted.');
        
        if (currentEditId === id) resetForm();
        fetchOrders();
    } catch (error) {
        console.error('Delete error:', error);
        alert('Could not delete the order.');
    }
}

/**
 * UTILITY: Clears inputs and reverts button state back to default
 */
function resetForm() {
    orderForm.reset();
    currentEditId = null;
    const submitBtn = orderForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Submit Order';
    submitBtn.className = 'btn btn-success w-100 py-2 fw-bold text-uppercase mt-2';
}

refreshBtn.addEventListener('click', fetchOrders);
document.addEventListener('DOMContentLoaded', fetchOrders);
