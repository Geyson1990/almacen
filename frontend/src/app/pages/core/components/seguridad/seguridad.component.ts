import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguridadService } from 'src/app/core/services/seguridad.service';

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.css']
})
export class SeguridadComponent implements OnInit {

  token: string;
  idTupa: string;
  component: string;
  
  constructor(private route: ActivatedRoute, 
              private router: Router,
              private seguridadService: SeguridadService) {

    this.token = this.route.snapshot.paramMap.get('token') == undefined ? '' : this.route.snapshot.paramMap.get('token');
    this.idTupa = this.route.snapshot.paramMap.get('idtupa') == undefined ? '' : this.route.snapshot.paramMap.get('idtupa');
    this.component = this.route.snapshot.paramMap.get('url') == undefined ? '' : this.route.snapshot.paramMap.get('url');
    
    sessionStorage.setItem("accessToken", this.token);
    localStorage.setItem("tupa-id", this.idTupa);
    localStorage.setItem("url", this.component);
  }
  
  ngOnInit() {
    this.seguridadService.get(this.token)
    .subscribe(
      resp => {
        console.log(resp);
      }
    );
    this.router.navigate([this.component]);//'/' + 
    console.log(this.seguridadService.getTokenExpirationDate());    
    console.log(this.seguridadService.isAuthenticated());    
    console.log(this.seguridadService.getNameId());     
  }

}

