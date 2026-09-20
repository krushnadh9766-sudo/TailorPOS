# TailorPOS Frontend Technical Documentation / Current State Report

This document provides a comprehensive read-only analysis of the current state of the TailorPOS frontend, based exclusively on the actual codebase located at `C:\Users\HP\OneDrive\Desktop\BinzaroDigital\TailorPOS`.

---

## 1. PROJECT OVERVIEW

* **Project name:** TailorPOS
* **Project location:** `C:\Users\HP\OneDrive\Desktop\BinzaroDigital\TailorPOS`
* **React Native version:** 0.87.1
* **React version:** 19.2.3
* **JavaScript/TypeScript:** JavaScript (No TypeScript configured in source files)
* **Android target information:** Identified via `package.json` (`@react-native-community/cli-platform-android`); compiled via `npx react-native run-android`. Target device: 6-inch Android POS device.
* **Current styling approach:** React Native `StyleSheet.create()` combined with a centralized theme system (`src/theme/`).
* **Navigation library:** React Navigation (`@react-navigation/native` v7.3.18, `@react-navigation/native-stack` v7.18.10).
* **State management approach:** React Context API (`AppProvider` wrapping the application, using `useState` for in-memory session persistence).
* **API/networking libraries:** None.
* **Storage libraries:** None. (No `AsyncStorage`, `SQLite`, or `Realm` installed).
* **Other important dependencies:** `react-native-safe-area-context` (v5.9.1), `react-native-screens` (v4.27.0).

---

## 2. COMPLETE DIRECTORY STRUCTURE

The current layout of the project:

```text
TailorPOS/
├── App.js                     # Main application entry point
├── package.json               # Dependencies and scripts
├── package-lock.json          # Dependency lockfile
├── android/                   # Native Android code
├── ios/                       # Native iOS code
└── src/
    ├── components/
    │   ├── BottomNavigation.js# Shared bottom tab bar UI
    │   ├── OrderCard.js       # Reusable card for displaying order info
    │   └── StatusBadge.js     # Colored badge for order statuses
    ├── data/
    │   ├── AppContext.js      # Global state provider and business logic functions
    │   └── mockData.js        # Initial hardcoded JSON structures for bootstrapping state
    ├── navigation/
    │   └── AppNavigator.js    # React Navigation Stack definition
    ├── screens/
    │   ├── CustomerDetailScreen.js
    │   ├── CustomersScreen.js
    │   ├── DashboardScreen.js
    │   ├── MeasurementsScreen.js
    │   ├── NewOrderScreen.js
    │   ├── OrderDetailScreen.js
    │   ├── OrdersScreen.js
    │   ├── PaymentScreen.js
    │   ├── ReceiptScreen.js
    │   └── SettingsScreen.js
    ├── theme/
    │   ├── colors.js          # Color palette variables (e.g., primary #2065AE)
    │   ├── spacing.js         # Padding/margin/radius constants
    │   └── typography.js      # Font sizing and weight constants
    └── types/
        └── index.js           # (Empty/unused JS file for types)
```

*(Note: Folders `src/context/`, `src/hooks/`, `src/services/`, `src/utils/`, `src/constants/`, and `src/assets/` do **not** exist in the current structure).*

---

## 3. APP ENTRY POINT

**File:** `App.js`

* **Imports:** React, `AppNavigator` (routing), `AppProvider` (global state).
* **Renders:** `<AppProvider>` wrapping `<AppNavigator />`.
* **Providers:** Yes, custom Context API provider (`AppProvider`).
* **Navigation initialization:** Yes, via nested `AppNavigator`.
* **Safe-area handling:** Not handled in `App.js` itself (handled individually inside each screen component via `<SafeAreaView>`).
* **Global configuration:** None present in `App.js`.

**Startup Flow:**
```text
App.js
   ↓
AppProvider (Initializes mock data into state arrays)
   ↓
AppNavigator (Initializes NavigationContainer)
   ↓
DashboardScreen (InitialRoute)
```

---

## 4. NAVIGATION AUDIT

* **Navigation library:** React Navigation v7
* **Navigator types:** Native Stack (`createNativeStackNavigator`)
* **Initial route:** `Dashboard`
* **Nested navigators:** None. The app strictly uses a flat Stack Navigator and fakes "tabs" using a custom UI component (`BottomNavigation.js`).
* **Missing/unused routes:** None. All registered routes are used.

**Route Table:**

| Route | Screen | Parameters | Can Navigate From | Can Navigate To | Status |
| ----- | ------ | ---------- | ----------------- | --------------- | ------ |
| `Dashboard` | `DashboardScreen` | None | BottomNav, Receipt, Splash | `Orders`, `NewOrder`, `Customers`, `Settings` | DONE |
| `Orders` | `OrdersScreen` | None | BottomNav, Dashboard | `OrderDetail` | DONE |
| `OrderDetail`| `OrderDetailScreen`| `{ orderId, order }` | `Orders`, `Dashboard` | `Payment`, `Receipt` | DONE |
| `NewOrder` | `NewOrderScreen` | None | BottomNav, Dashboard | `Customers`, `Receipt`, `Orders` | DONE |
| `Payment` | `PaymentScreen` | `{ order }` | `OrderDetail` | `Receipt` | DONE |
| `Receipt` | `ReceiptScreen` | `{ orderId }` | `Payment`, `OrderDetail`, `NewOrder` | `Dashboard` | DONE |
| `Customers` | `CustomersScreen` | None | BottomNav, Dashboard, NewOrder | `CustomerDetail`, `NewOrder` | DONE |
| `CustomerDetail`| `CustomerDetailScreen`| `{ customerId }` | `Customers` | `Measurements`, `NewOrder` | DONE |
| `Measurements`| `MeasurementsScreen`| `{ customerId }` | `CustomerDetail` | Back | DONE |
| `Settings` | `SettingsScreen` | None | BottomNav | Back | DONE |

**Actual Main Navigation Flows:**
```text
Dashboard → NewOrder → (Save/Print) → Receipt → Dashboard
Dashboard → Orders → OrderDetail → Payment → Receipt → Dashboard
Dashboard → Customers → CustomerDetail → Measurements
```

---

## 5. SCREEN-BY-SCREEN AUDIT

### DashboardScreen
* **File:** `src/screens/DashboardScreen.js`
* **Purpose:** Main landing view showing KPIs and quick links.
* **UI implemented:** Header, Stats Cards, Quick Actions grid, Recent Orders list.
* **User interactions:** Scrolling, clicking recent orders, clicking quick actions.
* **Navigation in:** App start, `BottomNavigation`.
* **Navigation out:** `Orders`, `NewOrder`, `Customers`, `Settings`, `OrderDetail`.
* **State used:** `orders` (from Context) to calculate totals dynamically.
* **Mock data used:** Initial values seeded via Context.
* **Status:** DONE.

### OrdersScreen
* **File:** `src/screens/OrdersScreen.js`
* **Purpose:** List all orders with filtering.
* **UI implemented:** Search bar, horizontal status filters, FlatList of `OrderCard` components.
* **User interactions:** Typing in search, tapping filters, tapping cards.
* **Navigation out:** `OrderDetail`.
* **State used:** `orders` (from Context).
* **Calculations:** Client-side `.filter()` against ID, Customer Name, and active status tab.
* **Status:** DONE.

### OrderDetailScreen
* **File:** `src/screens/OrderDetailScreen.js`
* **Purpose:** Show detailed breakdown of a specific order.
* **UI implemented:** Status header, Customer info block, Garments list, Payment summary block, Action buttons.
* **Interactions:** "Mark Ready", "Add Payment", "Print".
* **Navigation in:** `Orders`.
* **Navigation out:** `Payment`, `Receipt`.
* **State used:** Uses Context `orders` to find current order; calls `updateOrderStatus`.
* **Calculations:** Checks if balance exists to enable buttons.
* **Status:** DONE.

### NewOrderScreen
* **File:** `src/screens/NewOrderScreen.js`
* **Purpose:** 3-step wizard to create an order.
* **UI implemented:** Step indicator, search inputs, garment type scroller, price inputs, summary block.
* **Interactions:** Next/Back, add garment to list, recalculate totals.
* **Navigation out:** `Receipt` (if Print), `Orders` (if Save).
* **State used:** Context `customers` (for selection) and `addOrder` function. Local state for Wizard Step (`1,2,3`).
* **Form fields:** Garment type, quantity, price, extra charges, discount.
* **Calculations:** Subtotal = Garment Array Sum. Total = Subtotal + Extra - Discount. 
* **Status:** DONE.

### PaymentScreen
* **File:** `src/screens/PaymentScreen.js`
* **Purpose:** Receive partial or full payments.
* **UI implemented:** Payment summary, custom Numpad, "Receive Payment" button.
* **Interactions:** Tapping numpad updates the local amount string.
* **Navigation out:** `Receipt`.
* **State used:** Context `addPayment`.
* **Calculations:** Prevents paying more than the remaining balance. Updates total paid/balance in Context.
* **Status:** DONE.

### ReceiptScreen
* **File:** `src/screens/ReceiptScreen.js`
* **Purpose:** Render a printable receipt layout.
* **UI implemented:** Styled "paper" card with dashed dividers, shop info, itemized list, totals, buttons.
* **Interactions:** Print (Alert mock), Share (Native Share API).
* **Navigation out:** `Dashboard`.
* **State used:** Fetches specific `orderId` from Context.
* **Status:** DONE.

### CustomersScreen
* **File:** `src/screens/CustomersScreen.js`
* **Purpose:** List of customers.
* **UI implemented:** Search bar, list of customer cards showing Orders and Due amounts.
* **Navigation out:** `CustomerDetail`.
* **State used:** Context `customers`. Search uses client-side filtering.
* **Status:** DONE.

### CustomerDetailScreen
* **File:** `src/screens/CustomerDetailScreen.js`
* **Purpose:** Shows customer profile, their orders, and measurements.
* **UI implemented:** Profile header, Tab bar (Orders, Measurements, Payments), dynamic content areas, FAB ("Measure").
* **Navigation out:** `Measurements`, `OrderDetail`.
* **State used:** Context `customers` and `orders`. Filters global orders to match customer name.
* **Status:** DONE.

### MeasurementsScreen
* **File:** `src/screens/MeasurementsScreen.js`
* **Purpose:** Input/Edit measurements for a customer.
* **UI implemented:** Garment tab selector (Shirt/Pant etc.), grid of numeric inputs (Neck, Chest, Waist, etc.).
* **State used:** Local state for input values, Context `updateCustomerMeasurements` to persist to session.
* **Form fields:** 10+ dimensional inputs.
* **Status:** DONE.

### SettingsScreen
* **File:** `src/screens/SettingsScreen.js`
* **Purpose:** App configuration links.
* **UI implemented:** List of styled setting rows with icons.
* **Interactions:** All list items trigger a "Coming Soon" Alert.
* **Status:** PARTIALLY DONE (UI complete, logic pending).

---

## 6. DASHBOARD AUDIT

* **Header:** Static "Welcome Back" with current dynamic Date formatting.
* **Summary cards (Sales, Orders):** Dynamic. Values are dynamically calculated from the Context `orders` array using `.reduce`.
* **Pending/Ready cards:** Dynamic. Calculated by counting `orders` array filtering by status.
* **Quick actions:** Navigation buttons to New Order, Customers, Orders, Billing.
* **Recent Orders:** Dynamic. Slices the last 3 items from Context `orders`.
* **Data Sources:** 
  * Hardcoded: Shop name
  * Dynamic: Summary metrics, Recent list
  * Mock data: Initial seeds in Context
  * Backend/API: None.

---

## 7. ORDERS AUDIT

* **Order list:** Fully functional FlatList.
* **Search:** Functional client-side search by ID or Customer.
* **Filtering (Tabs):** Functional (All, Pending, In Progress, Ready, Delivered).
* **Order cards:** Render via `OrderCard` component.
* **Persistence:** Order state is **Local/Session-based**. It persists while the app is open but resets to `mockData.js` values if the app is hard-killed.

---

## 8. ORDER DETAIL AUDIT

* **Customer & Order info:** Dynamically read from Context.
* **Status updates:** Pressing "Mark Ready" dispatches `updateOrderStatus` in Context.
* **Add Payment:** Navigates to `PaymentScreen`.
* **Current Limitations:** Updating status updates the UI and local shared state (Context), but **does NOT** persist to a backend or AsyncStorage.

---

## 9. NEW ORDER AUDIT

The New Order flow strictly follows a 3-step wizard in `NewOrderScreen.js`.
* **Step 1 (Customer):** Search and select an existing customer from Context. (Customer creation UI button exists but navigates back to `CustomersScreen` - inline creation is pending).
* **Step 2 (Garments):** Add garments. Quantity and Price inputs work. Adding to local array works.
* **Step 3 (Summary):** Calculations for Subtotal, Extra Charges, Discount, and Total work dynamically.
* **Actions:** 
  * "Save Order" works. Appends to Context `orders` array, navigates to Orders.
  * "Save & Print" works. Appends to array, navigates to Receipt passing new ID.

---

## 10. PAYMENT AUDIT

* **Order Reference & Customer:** Displayed.
* **Totals:** Live calculated values shown for Total, Paid, Balance.
* **Amount Input:** Controlled by a custom Numpad. 
* **Validation:** Explicitly prevents paying '0' or an amount greater than the `order.balance`.
* **Receive Payment:** Works. Calls `addPayment` in Context which adjusts the paid/balance properties of the specific order.
* **Persistence:** Only session-level persistence via Context.

---

## 11. RECEIPT AUDIT

* **Shop information:** Hardcoded to "Tailor POS", "Rameevaram Tailor", "123 Main Street".
* **Receipt Number & Date:** Dynamically generated.
* **Data source:** Fetches the order using the `orderId` navigation parameter from Context. If `orderId` is missing, falls back to a hardcoded mock object.
* **Print:** `Alert.alert('Printing', 'Sending to thermal printer...')`
* **Share:** Uses React Native's native `Share.share()` API. Fully functional.

---

## 12. CUSTOMER AUDIT

* **Customer list:** Renders dynamically from Context.
* **Search:** Client-side text filtering against names and mobiles.
* **Order count / Due amount:** Static fields provided inside the mock customer object (not currently re-calculated dynamically from orders array).
* **Persistence:** Session-based.

---

## 13. CUSTOMER DETAIL AUDIT

* **Profile:** Displays static name and mobile.
* **Orders Tab:** Dynamically filters the global `orders` array to match the customer's name.
* **Measurements Tab:** Displays a grid of dimensional measurements. Edit button navigates to `MeasurementsScreen`.
* **Payments Tab:** UI placeholder ("Payment history will appear here").
* **Measure Button:** Proper FAB (Floating Action Button) on the bottom right.
* **New Order Button:** Redundant floating button removed; uses BottomNavigation instead.

---

## 14. MEASUREMENTS AUDIT

* **Garment tabs:** Available (Shirt, Pant, Kurta, Blouse, Suit).
* **Input handling:** Local state dictionary for standard fields (Length, Shoulder, Chest, etc.).
* **Save:** Dispatches `updateCustomerMeasurements` to Context. 
* **Persistence:** Local Context state only.
* **Data Source:** Context. NO `AsyncStorage` or `API`.

---

## 15. SETTINGS AUDIT

All items in `SettingsScreen.js` are currently UI placeholders:
* Shop Profile - Alert only
* Users - Alert only
* Printer - Alert only
* Payment Settings - Alert only
* Tax - Alert only
* Order Status - Alert only
* Measurement Templates - Alert only
* Backup - Alert only
* Language - Alert only
* Logout - Alert only

---

## 16. COMPONENT AUDIT

* **`BottomNavigation.js`**: Global fake-tab bar. Used globally via `position: absolute`. Has Home, Orders, center '+', Customers, Settings. Highly reusable. 
* **`StatusBadge.js`**: Displays a dot and text with dynamic color based on status strings. Reusable.
* **`OrderCard.js`**: Renders list items for Orders lists. Uses `StatusBadge`. Reusable.

---

## 17. THEME / STYLING AUDIT

* **Approach:** React Native `StyleSheet.create()` exclusively. No Tailwind/NativeWind.
* **Theme Files:** 
  * `src/theme/colors.js`: Defines primary as `#2065AE`, background as `#F5F7FA`, surface as `#FFFFFF`. (Actually used across all screens).
  * `src/theme/spacing.js`: Defines `sm`, `md`, `lg`, `xl` and `borderRadius`.
  * `src/theme/typography.js`: Defines font families and sizes (`h1`, `h2`, `body`, etc.).

---

## 18. STATE MANAGEMENT AUDIT

* **Approach:** React Context (`src/data/AppContext.js`).
* **Global state:** `orders`, `customers` arrays held in memory.
* **Mutation:** Exposes `addOrder`, `updateOrderStatus`, `addPayment`, `updateCustomerMeasurements`. Updates immediately propagate to all listening screens.
* **State flow:**
```text
Component (e.g., PaymentScreen)
   ↓ calls addPayment(id, amount)
Context (AppContext.js)
   ↓ updates 'orders' state
Component (e.g., DashboardScreen, OrderDetailScreen) -> re-renders automatically
```

---

## 19. DATA / MOCK DATA AUDIT

**File:** `src/data/mockData.js`

**Schemas:**
```javascript
Order: {
  id: "TP-0041",
  customer: "Rahul Sharma",
  customerMobile: "9876543210",
  items: [{ type: "Shirt", quantity: 2, price: 1400 }, ...],
  total: 2800,
  paid: 0,
  balance: 2800,
  dueDate: "28 Aug 2026",
  orderDate: "20 Aug 2026",
  status: "In Progress"
}

Customer: {
  id: "c1",
  name: "Rahul Sharma",
  mobile: "9876543210",
  orders: 8,
  due: 1200,
  measurements: { chest: '39"', waist: '38"' ... }
}
```

---

## 20. API / BACKEND AUDIT

After performing an explicit regex search across all files for `axios`, `fetch`, `http`, `/api`:

* **Current backend status:** NOT IMPLEMENTED.
* **Current data source:** MOCK / LOCAL CONTEXT DATA.
* **API Endpoints:** None exist.

---

## 21. DATABASE AUDIT

After searching for persistence libraries:

* **Database persistence:** NOT IMPLEMENTED. (No SQLite, Realm, or AsyncStorage installed).

---

## 22. AUTHENTICATION AUDIT

* **Authentication:** NOT IMPLEMENTED. App boots directly into the Dashboard without a login screen.

---

## 23. PRINTER / RECEIPT AUDIT

* **Real printing:** Not implemented.
* **Mock:** Tapping "Print" triggers an `Alert.alert`.
* **Share:** Fully functional using React Native's `Share` API.

---

## 24. OFFLINE / STORAGE AUDIT

* **Current behavior:** App works perfectly offline because all data is stored in React State RAM.
* **After app restart:** All data resets to the default mock JSON arrays. No caching or synchronization exists.

---

## 25. ERROR HANDLING AUDIT

* **Form validation:** Numeric keypads prevent NaN inputs. "Next" buttons disable if customer or items are missing. Payment prevents overpaying.
* **Loading states:** None exist (because data is instant/in-memory).
* **Known weaknesses:** Adding a customer inline during `NewOrder` is not fully wired; navigating to `CustomersScreen` loses wizard state.

---

## 26. UI / UX AUDIT

**Target:** 6-inch Android POS device.
* **Touch targets:** Excellent. Buttons have substantial padding (`spacing.lg`, `minWidth: 50`), ensuring thumb-friendly usage.
* **Scrolling:** Content properly wrapped in `<ScrollView>` preventing screen overflow on smaller POS screens.
* **Keyboard handling:** Numpads are custom UI, bypassing native OS keyboard overlaps entirely during payments. Search inputs rely on default OS behavior.
* **Bottom navigation:** Uses `position: 'absolute'` floating cleanly over scrollviews with padding bottoms applied to content.

---

## 27. BUSINESS LOGIC AUDIT

* **Orders:** Subtotal, Extra Charges, Discount, Total accurately calculated in `NewOrderScreen`.
* **Payments:** Remaining balance accurately protects against overpayment. Subtracts amount from balance, adds to paid.
* **Customers:** Order count and due amounts are currently static in the mock JSON, not dynamically reduced from the order array.
* **Measurements:** Dictionary-based overwriting works perfectly.

---

## 28. FILE-BY-FILE STATUS

| File | Purpose | Used? | Complete? | Depends On | Notes |
| ---- | ------- | ----- | --------- | ---------- | ----- |
| `AppContext.js` | Global State | Yes | Yes | `mockData.js` | Memory only |
| `AppNavigator.js` | Routing | Yes | Yes | Screens | |
| `DashboardScreen` | Landing KPI | Yes | Yes | Context | |
| `NewOrderScreen` | Order Wizard | Yes | Yes | Context | |
| `PaymentScreen` | POS Numpad | Yes | Yes | Context | |
| `ReceiptScreen` | Final Output | Yes | Yes | Context | Print is mocked |
| `SettingsScreen` | Configurations | Yes | No | None | UI Placeholder |

---

## 29. FEATURE STATUS MATRIX

| Feature | UI | Logic | Local Data | Persistent | API | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Dashboard | ✔ | ✔ | ✔ | ❌ | ❌ | DONE |
| Orders | ✔ | ✔ | ✔ | ❌ | ❌ | DONE |
| Order Detail | ✔ | ✔ | ✔ | ❌ | ❌ | DONE |
| New Order | ✔ | ✔ | ✔ | ❌ | ❌ | DONE |
| Payment | ✔ | ✔ | ✔ | ❌ | ❌ | DONE |
| Receipt | ✔ | ✔ | ✔ | ❌ | ❌ | DONE (Share) / MOCK (Print) |
| Customers | ✔ | ✔ | ✔ | ❌ | ❌ | DONE |
| Measurements | ✔ | ✔ | ✔ | ❌ | ❌ | DONE |
| Settings | ✔ | ❌ | ❌ | ❌ | ❌ | PENDING |
| Backend | ❌ | ❌ | ❌ | ❌ | ❌ | PENDING |

---

## 30. WHAT IS COMPLETELY DONE?

* **UI Theme Engine:** Fully implemented with constants.
* **Navigation:** Complete stack and tab illusion.
* **Order Creation:** Fully mathematical 3-step wizard.
* **Payment Collection:** Fully mathematical logic preventing overpayment.
* **Receipt Generation:** Text compilation and Native OS Sharing.
* **Measurements Engine:** Form to record specific dimensions.
* **State Propagation:** Local data binds reactively across screens.

---

## 31. WHAT IS PARTIALLY DONE?

* **Receipt Printing:** UI layout complete, but hardware Bluetooth ESC/POS integration is missing (mocked with Alert).
* **Settings:** Options listed, but do nothing.
* **Customer Stats:** Customer profiles show total due/orders from static mock data rather than dynamically calculating from the global orders array.

---

## 32. WHAT IS PENDING?

* **Backend / API implementation.**
* **Local Persistence (AsyncStorage/SQLite).**
* **Authentication/Login.**
* **Hardware Printer Integration.**

---

## 33. KNOWN ISSUES / RISKS

* **Data Loss:** Because `AsyncStorage` or a Database is not implemented, killing the app from memory deletes all new orders, payments, and customers created during the session.
* **Customer Creation Loop:** Clicking "+ Add New Customer" from step 1 of NewOrder jumps to the Customers list. If you add one, returning to NewOrder resets the wizard back to Step 1.
* **Hardcoded Shop Info:** Shop Name and Address in the receipt are hardcoded strings, not pulled from a Settings configuration.

---

## 34. BACKEND REQUIREMENTS FROM FRONTEND

Based strictly on frontend capabilities, the backend will require:

* **Authentication API:** For logging in cashiers/managers.
* **Customers API:**
  * `GET /customers`
  * `POST /customers`
  * `PUT /customers/:id/measurements`
* **Orders API:**
  * `GET /orders` (with status filters)
  * `POST /orders` (create with items, discounts, extra charges)
  * `PUT /orders/:id/status`
* **Payments API:**
  * `POST /orders/:id/payments`
* **Settings/Shop Profile API:**
  * `GET /shop-info` (to populate Receipt headers dynamically).

---

## 35. DATABASE REQUIREMENTS FROM FRONTEND

Expected relational schema based on current objects:

* **Customer:** `id`, `name`, `mobile`, JSON column for `measurements`.
* **Order:** `id`, `customer_id`, `status`, `total`, `paid`, `balance`, `due_date`, `created_at`, `extra_charges`, `discount`.
* **OrderItem:** `id`, `order_id`, `type`, `quantity`, `price`.
* **PaymentTransaction:** `id`, `order_id`, `amount`, `method`, `timestamp`.
* **ShopSettings:** `id`, `shop_name`, `address`, `phone`.

---

## 36. FRONTEND → FUTURE BACKEND MAPPING

| Frontend Screen | Current Data Source | Future API Needed | Future Database Entity |
| --------------- | ------------------- | ----------------- | ---------------------- |
| `DashboardScreen` | Context (`orders`) | `GET /analytics/summary` | Order |
| `OrdersScreen` | Context (`orders`) | `GET /orders` | Order |
| `NewOrderScreen` | Local State + Context| `POST /orders` | Order, OrderItem |
| `PaymentScreen` | Local State + Context| `POST /payments` | PaymentTransaction |
| `CustomersScreen` | Context (`customers`)| `GET /customers` | Customer |
| `MeasurementsScreen`| Local State + Context| `PUT /customers/:id` | Customer |
| `SettingsScreen` | None | `GET, PUT /settings`| ShopSettings, User |

---

## 37. FINAL CURRENT-STATE SUMMARY

**PROJECT STATUS**
* **Frontend:** 100% UI complete (React Native).
* **Navigation:** 100% complete.
* **State:** Session-only (React Context).
* **Mock Data:** Yes, heavily utilized to simulate API.
* **API / Backend:** 0% implemented.
* **Database / Offline Storage:** 0% implemented.
* **Authentication:** 0% implemented.
* **Printing:** Native Share complete; Thermal Print missing.

**CURRENTLY WORKING FLOW**
The application functions as a high-fidelity, fully interactive prototype. Users can navigate the entire POS flow—creating an order, applying payments, changing statuses, entering measurements, and generating shareable receipts—with math and reactivity working perfectly during the active session.

**MAIN PENDING WORK**
The immediate next phase requires ripping out `src/data/mockData.js` and `src/data/AppContext.js` and replacing them with an API service layer (e.g., `axios` + `TanStack Query`) pointing to a newly created backend, alongside configuring local persistence (e.g., `AsyncStorage` or `WatermelonDB`) to prevent session data loss.

