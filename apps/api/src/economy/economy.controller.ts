import { Body, Controller, Get, Post } from "@nestjs/common";
import type {
  PurchaseRequest,
  StoreItem,
  TransactionResponse,
  WalletResponse
} from "@gamedash/contracts";

@Controller("economy")
export class EconomyController {
  @Get("store/items")
  getStoreItems(): StoreItem[] {
    return [
      { id: "item-soft-1", name: "Starter Skin", currencyType: "soft", price: 200 },
      { id: "item-hard-1", name: "Premium Skin", currencyType: "hard", price: 5 }
    ];
  }

  @Get("wallet")
  getWallet(): WalletResponse {
    return {
      softBalance: 1000,
      hardBalance: 20
    };
  }

  @Post("transactions/purchase")
  purchase(@Body() body: PurchaseRequest): TransactionResponse {
    return {
      transactionId: `txn-${body.storeItemId}-${Date.now()}`,
      status: "accepted"
    };
  }
}
