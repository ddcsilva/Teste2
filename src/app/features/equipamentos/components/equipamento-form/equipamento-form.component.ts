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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Equipamento } from '../../models/equipamento.model';
import { EquipamentoService } from '../../services/equipamento.service';
import { CabecalhoPaginaComponent } from '../../../../shared/components/cabecalho-pagina/cabecalho-pagina.component';

// Importar apenas o componente de botão personalizado
import { BotaoComponent } from '../../../../shared/ui/botao/botao.component';

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
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    CabecalhoPaginaComponent,
    // Apenas o componente de botão personalizado
    BotaoComponent,
  ],
  templateUrl: './equipamento-form.component.html',
  styleUrls: ['./equipamento-form.component.scss'],
})
export class EquipamentoFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() titulo = '';
  @Input() botaoSubmit = '';
  @Input() codigoEquipamento: number | null = null;
  @Output() formularioEnviado = new EventEmitter<Equipamento>();

  formulario!: FormGroup;
  categoriasAutoComplete$!: Observable<InputAutoComplete[]>;
  localizacoes: { codigo: string; nome: string }[] = [];
  equipamento: Equipamento | null = null;
  categorias: InputAutoComplete[] = [];
  carregandoCategorias = false;

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

          return nome ? this.filtrarCategorias(nome) : this.categorias.slice();
        }),
        takeUntil(this.unsubscribe$)
      );
    }
  }

  filtrarCategorias(nome: string): InputAutoComplete[] {
    const filtro = nome.toLowerCase();
    return this.categorias.filter((categoria) =>
      categoria.nome.toLowerCase().includes(filtro)
    );
  }

  exibirCategoria(categoria: InputAutoComplete): string {
    return categoria && categoria.nome ? categoria.nome : '';
  }

  aoSelecionarCategoria(event: any): void {
    const categoria = event.option.value;
    this.formulario.patchValue({ categoria });
  }

  aoDigitarCategoria(event: any): void {
    const valor = event.target.value;

    if (typeof valor === 'string' && valor.length >= 3) {
      this.carregandoCategorias = true;

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
    if (linkDiagrama && linkDiagrama.trim()) {
      // Garantir que o link tenha um protocolo
      let url = linkDiagrama.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  prepararObjetoEquipamento(): Equipamento {
    const formValue = this.formulario.value;
    const categoria = formValue.categoria;

    return {
      id: formValue.codigoEquipamento,
      codigo: formValue.codigo,
      categoriaId: categoria?.id || categoria,
      categoria: categoria?.nome || categoria,
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
