# TechShop

This is a NextJS starter in Firebase Studio, configured as an electronics e-commerce store called TechShop.

To get started, take a look at src/app/page.tsx.

## Sample Data Structure (JSON)

Below is an example of how user, product, and order data could be structured, for instance, in a NoSQL database like Firestore. This is for illustrative purposes based on the application's data types.

```json
{
  "users": {
    "user_firebase_uid_1": {
      "uid": "user_firebase_uid_1",
      "email": "customer1@example.com",
      "displayName": "Ali Torebek",
      "createdAt": "2024-01-15T09:30:00Z"
    },
    "user_firebase_uid_2": {
      "uid": "user_firebase_uid_2",
      "email": "anothercustomer@example.com",
      "displayName": "Aisha Serik",
      "createdAt": "2024-02-10T14:00:00Z"
    }
  },
  "products": {
    "prod_el_1": {
      "id": "prod_el_1",
      "name": "AuraBeat Pro Wireless Headphones",
      "description": "Immerse yourself in pure audio bliss...",
      "price": 112495,
      "categoryId": "cat_sub_3_1",
      "categoryName": "Наушники и гарнитуры",
      "stock": 50,
      "brand": "AuraAudio",
      "sku": "AU-HP-789",
      "dateAdded": "2024-01-10T10:00:00Z"
    },
    "prod_el_2": {
      "id": "prod_el_2",
      "name": "NovaPhone X2 Ultra Smartphone",
      "description": "Experience the future with NovaPhone X2 Ultra...",
      "price": 449550,
      "categoryId": "cat_sub_1_1",
      "categoryName": "Смартфоны",
      "stock": 35,
      "brand": "NovaTech",
      "sku": "SM-NP-X2U",
      "dateAdded": "2024-01-15T10:00:00Z"
    }
  },
  "orders": {
    "TECHSHOP-SAMPLE-001": {
      "id": "TECHSHOP-SAMPLE-001",
      "firebaseUserId": "user_firebase_uid_1",
      "date": "2024-06-20T10:30:00Z",
      "items": [
        {
          "productId": "prod_el_1",
          "name": "AuraBeat Pro Wireless Headphones",
          "price": 112495,
          "quantity": 1,
          "imageUrl": "https://placehold.co/100x100.png"
        },
        {
          "productId": "prod_el_2",
          "name": "NovaPhone X2 Ultra Smartphone",
          "price": 449550,
          "quantity": 1,
          "imageUrl": "https://placehold.co/100x100.png"
        }
      ],
      "totalPrice": 562045,
      "shippingAddress": {
        "fullName": "Ali Torebek",
        "email": "customer1@example.com",
        "phoneNumber": "+77011234567",
        "addressLine1": "Abay Ave 42",
        "addressLine2": "Apt 15",
        "city": "Almaty",
        "postalCode": "050000",
        "country": "Казахстан"
      },
      "paymentMethod": {
        "id": "cod",
        "name": "Картой или наличными при получении",
        "description": "Оплатите заказ курьеру или в пункте выдачи."
      },
      "status": "pending"
    },
    "TECHSHOP-SAMPLE-002": {
      "id": "TECHSHOP-SAMPLE-002",
      "firebaseUserId": "user_firebase_uid_2",
      "date": "2024-06-21T11:45:00Z",
      "items": [
        {
          "productId": "prod_el_14",
          "name": "MacBook Air 13\" M3 Chip",
          "price": 494550,
          "quantity": 1,
          "imageUrl": "https://placehold.co/100x100.png"
        }
      ],
      "totalPrice": 494550,
      "shippingAddress": {
        "fullName": "Aisha Serik",
        "email": "anothercustomer@example.com",
        "phoneNumber": "+77779876543",
        "addressLine1": "Satpayev St 111",
        "city": "Astana",
        "postalCode": "010000",
        "country": "Казахстан"
      },
      "paymentMethod": {
        "id": "kaspi_qr",
        "name": "Kaspi QR (имитация)",
        "description": "Отсканируйте QR-код через приложение Kaspi.kz (имитация)."
      },
      "status": "processing"
    }
  }
}
```
