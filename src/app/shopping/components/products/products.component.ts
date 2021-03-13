import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from 'shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'shared/models/product';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products= [];
  filteredProducts: Product[] = [];
  category: string;
  cart$;
  sub: Subscription;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: ShoppingCartService
  ) { 
    this.sub = productService.getAll().subscribe(prods => this.products = prods);
   }

  async ngOnInit() {
    this.cart$ = await this.cartService.getCart();
    this.populateProduct();
  }

  private populateProduct() {
    this.productService
      .getAll()
      .switchMap(products => {
        this.products = products;
        return this.route.queryParamMap;
      })
      .subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
  }

  private applyFilter() {
    this.filteredProducts = (this.category) ?
    this.products.filter(p => p.category === this.category) :
    this.products;
  }



  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
