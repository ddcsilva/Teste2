import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { Login } from '../../../shared/models/login.model';
import { FormularioLoginService } from '../../services/formulario-login.service';
import { ToUppercaseDirective } from '../../../shared/directives/to-uppercase.directive';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ToUppercaseDirective,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  formulario: FormGroup;
  estaProcessando = false;
  esconderSenha = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public formularioLoginService: FormularioLoginService
  ) {
    this.formulario = this.fb.group({
      chave: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.authService.estaLogado()) {
      this.router.navigate(['/']);
    }
  }

  alternarVisibilidadeSenha(): void {
    this.esconderSenha = !this.esconderSenha;
  }

  aoEntrar(): void {
    if (this.formulario.invalid) return;

    this.estaProcessando = true;
    const dados: Login = this.formulario.getRawValue();

    this.authService.logar(dados).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (erro) => {
        console.error('Erro ao fazer login:', erro);
        this.estaProcessando = false;
        // Aqui você pode adicionar um snackbar ou toast para mostrar o erro
      },
      complete: () => {
        this.estaProcessando = false;
      },
    });
  }
}
