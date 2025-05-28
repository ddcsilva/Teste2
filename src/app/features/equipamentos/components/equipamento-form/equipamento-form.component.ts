import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroupDirective,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, catchError, Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Equipamento } from '../../models/equipamento.model';
import { EquipamentoService } from '../../services/equipamento.service';
import { CabecalhoPaginaComponent } from '../../../../shared/components/cabecalho-pagina/cabecalho-pagina.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../../shared/ui/select/select.component';
import { OpcaoSelect } from '../../../../shared/ui/select/select.types';

interface InputAutoComplete {
  id: number;
  nome: string;
}

interface InputSelect {
  id: any;
  nome: string;
}

@Component({
  selector: 'app-equipamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CabecalhoPaginaComponent,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './equipamento-form.component.html',
  styleUrls: ['./equipamento-form.component.scss'],
})
export class EquipamentoFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() titulo: string = '';
  @Input() botaoSubmit: string = '';
  @Input() codigoEquipamento: number | null = null;
  @Output() formularioEnviado = new EventEmitter<Equipamento>();

  formulario!: FormGroup;
  categoriasAutoComplete$!: Observable<InputAutoComplete[]>;
  localizacoes: { codigo: string; nome: string }[] = [];
  equipamento: Equipamento | null = null;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private equipamentoService: EquipamentoService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.obterDadosIniciais();
    this.configurarAutoComplete();
  }

  ngAfterViewInit(): void {
    if (this.codigoEquipamento) {
      this.carregarEquipamento(this.codigoEquipamento);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  criarFormulario(): void {
    this.formulario = this.formBuilder.group({
      codigoEquipamento: [null],
      codigo: [null, [Validators.required, Validators.maxLength(50)]],
      categoria: [null, [Validators.required]],
      codigoLocalizacao: [null, [Validators.required]],
      linkDiagrama: [null, [Validators.maxLength(500)]],
    });
  }

  configurarAutoComplete(): void {
    const categoriaControl = this.formulario.get('categoria');
    if (categoriaControl) {
      this.categoriasAutoComplete$ = this.configurarAutoCompleteGenerico(
        categoriaControl.valueChanges,
        (filtro) => this.pesquisarCategorias(filtro),
        'Erro ao Buscar Categorias'
      );
    }
  }

  configurarAutoCompleteGenerico(
    valueChanges: Observable<any>,
    searchFunction: (filtro: string) => Observable<InputAutoComplete[]>,
    errorMessage: string
  ): Observable<InputAutoComplete[]> {
    return valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      catchError((error) => {
        console.error(errorMessage, error);
        return of([]);
      })
    );
  }

  pesquisarCategorias(filtro: string): Observable<InputAutoComplete[]> {
    if (typeof filtro === 'string' && filtro.length >= 3) {
      return this.equipamentoService.obterCategorias().pipe(
        takeUntil(this.unsubscribe$),
        catchError(() => of([]))
        // Simular busca por nome
        // Em um caso real, o serviço teria um método específico para busca
      );
    } else {
      return of([]);
    }
  }

  obterDadosIniciais(): void {
    this.equipamentoService
      .obterLocalizacoes()
      .pipe(
        catchError((error) => {
          console.error('Erro ao Buscar as Localizações', error);
          return of([]);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((localizacoes) => (this.localizacoes = localizacoes));
  }

  carregarEquipamento(codigo: number): void {
    this.equipamentoService
      .obterPorId(codigo)
      .pipe(
        catchError((error) => {
          console.error('Erro ao Buscar Equipamento', error);
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((equipamento) => {
        if (equipamento) {
          this.equipamento = equipamento;
          const localizacao = this.determinarLocalizacaoAoCarregar(
            equipamento.codigoLocalizacao,
            equipamento.localizacao
          );

          this.formulario.patchValue({
            codigoEquipamento: equipamento.id,
            categoria: {
              id: equipamento.categoriaId,
              nome: equipamento.categoria,
            },
            codigo: equipamento.codigo,
            codigoLocalizacao: {
              id: localizacao.codigo,
              nome: localizacao.nome,
            },
            linkDiagrama: equipamento.linkDiagrama,
          });
        } else {
          console.error('Houve um erro ao carregar o equipamento');
        }
      });
  }

  aoSalvar(): void {
    if (this.formulario.valid) {
      const equipamento = this.prepararObjetoEquipamento();
      this.formularioEnviado.emit(equipamento);
    } else {
      this.marcarCamposComoTocados();
    }
  }

  aoCancelar(formulario: FormGroupDirective): void {
    formulario.onReset();
    this.router.navigate(['/cadastrosBasicos/equipamentos/']);
  }

  aoLimpar(formulario: FormGroupDirective): void {
    formulario.reset();
  }

  aoCompararOptionValue(option: InputSelect, value: InputSelect): boolean {
    return option?.id === value?.id;
  }

  aoAbrirDiagramaEquipamento(): void {
    const linkDiagrama = this.formulario.get('linkDiagrama')?.value;
    if (linkDiagrama) {
      window.open(linkDiagrama);
    }
  }

  prepararObjetoEquipamento(): Equipamento {
    const formValue = this.formulario.value;
    return {
      id: formValue.codigoEquipamento,
      codigo: formValue.codigo,
      categoriaId: formValue.categoria.id,
      categoria: formValue.categoria.nome,
      codigoLocalizacao: this.determinarLocalizacaoAoSalvar(
        formValue.codigoLocalizacao.id
      ),
      localizacao: formValue.codigoLocalizacao.nome,
      linkDiagrama: formValue.linkDiagrama,
    };
  }

  determinarLocalizacaoAoSalvar(codigo: string): string {
    return codigo === 'N' ? '' : codigo;
  }

  determinarLocalizacaoAoCarregar(
    codigo: string | null,
    nome: string
  ): { codigo: string; nome: string } {
    return {
      codigo: !codigo ? 'N' : codigo,
      nome: nome === '' ? 'NÃO INFORMADO' : nome,
    };
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach((campo) => {
      this.formulario.get(campo)?.markAsTouched();
    });
  }

  // Getters para facilitar validação no template
  get codigo() {
    return this.formulario.get('codigo');
  }
  get categoria() {
    return this.formulario.get('categoria');
  }
  get codigoLocalizacao() {
    return this.formulario.get('codigoLocalizacao');
  }
  get linkDiagrama() {
    return this.formulario.get('linkDiagrama');
  }
}
