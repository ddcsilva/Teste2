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
import {
  Observable,
  of,
  catchError,
  Subject,
  takeUntil,
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Equipamento } from '../../models/equipamento.model';
import { EquipamentoService } from '../../services/equipamento.service';
import { CabecalhoPaginaComponent } from '../../../../shared/components/cabecalho-pagina/cabecalho-pagina.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../../shared/ui/select/select.component';
import { AutocompleteComponent } from '../../../../shared/ui/autocomplete/autocomplete.component';
import { OpcaoAutocomplete } from '../../../../shared/ui/autocomplete/autocomplete.types';
import { OpcaoSelect } from '../../../../shared/ui/select/select.types';

interface InputAutoComplete {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-equipamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    CabecalhoPaginaComponent,
    InputComponent,
    SelectComponent,
    AutocompleteComponent,
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
  categoriasAutoComplete$!: Observable<OpcaoAutocomplete[]>;
  localizacoes: { codigo: string; nome: string }[] = [];
  equipamento: Equipamento | null = null;
  categorias: InputAutoComplete[] = [];
  carregandoCategorias = false;
  opcoesLocalizacao: OpcaoSelect[] = [];

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
      this.categoriasAutoComplete$ = categoriaControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => {
          const nome = typeof value === 'string' ? value : value?.nome || '';

          if (
            typeof value === 'string' &&
            value.length > 0 &&
            value.length < 3
          ) {
            return [];
          }

          return nome
            ? this.filtrarCategorias(nome)
            : this.categorias.map((cat) => ({
                id: cat.id,
                nome: cat.nome,
              }));
        }),
        takeUntil(this.unsubscribe$)
      );
    }
  }

  filtrarCategorias(nome: string): OpcaoAutocomplete[] {
    const filtro = nome.toLowerCase();
    return this.categorias
      .filter((categoria) => categoria.nome.toLowerCase().includes(filtro))
      .map((categoria) => ({
        id: categoria.id,
        nome: categoria.nome,
      }));
  }

  exibirCategoria = (categoria: any): string => {
    return categoria && categoria.nome ? categoria.nome : '';
  };

  aoSelecionarCategoria(categoria: any): void {
    this.formulario.patchValue({ categoria });
  }

  aoDigitarCategoria(termo: string): void {
    if (termo && termo.length >= 3) {
      this.carregandoCategorias = true;

      // Simular delay de busca (remover em produção se não houver API real)
      setTimeout(() => {
        this.carregandoCategorias = false;
      }, 500);
    } else {
      this.carregandoCategorias = false;
    }
  }

  obterDadosIniciais(): void {
    // Carregar categorias
    this.equipamentoService
      .obterCategorias()
      .pipe(
        catchError((error) => {
          console.error('Erro ao Buscar as Categorias', error);
          return of([]);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((categorias) => {
        this.categorias = categorias;
      });

    // Carregar localizações
    this.equipamentoService
      .obterLocalizacoes()
      .pipe(
        catchError((error) => {
          console.error('Erro ao Buscar as Localizações', error);
          return of([]);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((localizacoes) => {
        this.localizacoes = localizacoes;
        this.opcoesLocalizacao = localizacoes.map((loc) => ({
          valor: { id: loc.codigo, nome: loc.nome },
          texto: loc.nome,
        }));
      });
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

  prepararObjetoEquipamento(): Equipamento {
    const formValue = this.formulario.value;
    const categoria = formValue.categoria;
    const localizacao = formValue.codigoLocalizacao;

    return {
      id: formValue.codigoEquipamento,
      codigo: formValue.codigo,
      categoriaId: categoria?.id || categoria,
      categoria: categoria?.nome || categoria,
      codigoLocalizacao: this.determinarLocalizacaoAoSalvar(
        localizacao?.id || localizacao
      ),
      localizacao: localizacao?.nome || localizacao,
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
