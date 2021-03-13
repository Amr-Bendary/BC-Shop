import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AppUser } from "shared/models/app-user";
import { Product } from "shared/models/product";
import { AuthService } from "shared/services/auth.service";
import { CategoryService } from "shared/services/category.service";
import { ProductService } from "shared/services/product.service";
import { ShoppingCartService } from "shared/services/shopping-cart.service";

@Component({
  selector: "app-bs-navbar",
  templateUrl: "./bs-navbar.component.html",
  styleUrls: ["./bs-navbar.component.css"],
})
export class BsNavbarComponent implements OnInit, OnDestroy {
  public isExpanded = false;
  appUser: AppUser;
  cart$;
  products = [];
  filteredProducts: Product[] = [];
  category: string;
  categories$;
  sub: Subscription;
  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: ShoppingCartService,
    private router: Router,
    categoryService: CategoryService
  ) {
    this.categories$ = categoryService.getAll();
  }

  async ngOnInit() {
    this.authService.appUser$.subscribe((user) => (this.appUser = user));
    this.cart$ = await this.cartService.getCart();
    this.populateProduct();
  }

  isHome() {
    return (
      this.router.url === "/" ||
      this.router.url === "/?category=plastic" ||
      this.router.url === "/?category=crown" ||
      this.router.url === "/?category=aluminum" ||
      this.router.url === "/?category=ring" ||
      this.router.url === "/?category=ripCap"
    );
  }
 
  catName(c: string) {
    return c.slice(3);
  }

  private populateProduct() {
    this.productService
      .getAll()
      .switchMap((products) => {
        this.products = products;
        return this.route.queryParamMap;
      })
      .subscribe((params) => {
        this.category = params.get("category");
        this.applyFilter();
      });
  }

  private applyFilter() {
    this.filteredProducts = this.category
      ? this.products.filter((p) => p.category === this.category)
      : this.products;
  }

  toggleCategories() {
    document.querySelector("#cats").classList.toggle("showCats");
    document.querySelector(".hasCats").classList.toggle("disappear");
  }

  toggleSideNav() {
    document.querySelector(".togglerIcon").classList.toggle("togglerIconOpen");
    document.querySelector(".sideNav").classList.toggle("showSideNav");
    document.querySelector("#cats") ? document.querySelector("#cats").classList.remove("showCats") : null;
    document.querySelector("#tglr").classList.toggle("active");
    this.isExpanded = !this.isExpanded;
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
