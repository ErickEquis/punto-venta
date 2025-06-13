import { Component } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Productos } from '../../interfaces/productos';
import { Cuenta } from '../../interfaces/cuenta';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { VentasService } from 'src/app/point/ventas/services/ventas.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  host: {
    'class': 'vh-100 row',
  }
})
export class HomePageComponent {

  clienteVisible: number = 1;
  totalVenta: number = 0;
  clientes: Cuenta[] = [{ id: 1, totalVenta: 0 }];

  constructor() {}

  abrirCuenta(i: number) {
    this.clienteVisible = this.clientes[i].id;
  }
  borrarCliente(i: number) {
    if (!confirm('¿Desea eliminar la cuenta?')) { return; }
    this.clientes.splice(i, 1);
    if (this.clientes.length < 1) {
      this.clientes = [
        {
          id: 1,
          totalVenta: 0,
        }
      ];
      this.clienteVisible = this.clientes[0].id;
    } else {
      this.clienteVisible = this.clientes[0].id;
    }
  }
  nuevaCuenta() {
    const nuevaCuentaId = this.clientes[this.clientes.length - 1].id + 1;
    this.clientes.push({
          id: nuevaCuentaId,
          totalVenta: 0,
        });
    this.clienteVisible = this.clientes[this.clientes.length - 1].id;
  }

  updateTotalVenta({totalVenta, clienteIndex}) {
    this.clientes[clienteIndex].totalVenta = totalVenta;
  }
}
