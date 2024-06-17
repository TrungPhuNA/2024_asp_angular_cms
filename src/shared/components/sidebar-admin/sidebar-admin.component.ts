// sidebar-admin.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent {
  @Input() isCollapsed = false;

  toggleMobileMenu() {
    // Logic to toggle mobile menu if needed
    if (window.innerWidth < 1024) {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
