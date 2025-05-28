import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../models/equipamento.model';
import { CabecalhoPaginaComponent } from '../../../../shared/components/cabecalho-pagina/cabecalho-pagina.component';
import { BotaoComponent } from '../../../../shared/ui/botao/botao.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SelectComponent } from '../../../../shared/ui/select/select.component';
import { OpcaoSelect } from '../../../../shared/ui/select/select.types';

@Component({
  selector: 'app-equipamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CabecalhoPaginaComponent,
    BotaoComponent,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './equipamento-form.component.html',
  styleUrls: ['./equipamento-form.component.scss'],
})
export class EquipamentoFormComponent implements OnInit, OnDestroy {
  formulario!: FormGroup;
  equipamentoId: number | null = null;
  isEdicao = false;

  // Signals para reatividade
  carregando = signal(false);
  salvando = signal(false);

  // Dados para selects
  categorias: { id: number; nome: string }[] = [];
  localizacoes: { codigo: string; nome: string }[] = [];

  // Computed para opções dos selects
  opcoesCategoria = computed<OpcaoSelect[]>(() =>
    this.categorias.map((categoria) => ({
      valor: categoria.id,
      texto: categoria.nome,
    }))
  );

  opcoesLocalizacao = computed<OpcaoSelect[]>(() =>
    this.localizacoes.map((localizacao) => ({
      valor: localizacao.codigo,
      texto: localizacao.nome,
    }))
  );

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private equipamentoService: EquipamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {
    this.equipamentoId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdicao = !!this.equipamentoId;

    this.carregarDadosIniciais();

    if (this.isEdicao) {
      this.carregarEquipamento();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private criarFormulario(): void {
    this.formulario = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      categoriaId: ['', [Validators.required]],
      codigoLocalizacao: ['', [Validators.required]],
      linkDiagrama: ['', [Validators.maxLength(500)]],
    });
  }

  private carregarDadosIniciais(): void {
    this.carregando.set(true);

    forkJoin({
      categorias: this.equipamentoService.obterCategorias(),
      localizacoes: this.equipamentoService.obterLocalizacoes(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dados) => {
          this.categorias = dados.categorias;
          this.localizacoes = dados.localizacoes;
          this.carregando.set(false);
        },
        error: (erro) => {
          console.error('Erro ao carregar dados iniciais:', erro);
          this.snackBar.open('Erro ao carregar dados iniciais', 'Fechar', {
            duration: 5000,
          });
          this.carregando.set(false);
        },
      });
  }

  private carregarEquipamento(): void {
    if (!this.equipamentoId) return;

    this.carregando.set(true);

    this.equipamentoService
      .obterPorId(this.equipamentoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (equipamento) => {
          if (equipamento) {
            this.formulario.patchValue({
              codigo: equipamento.codigo,
              categoriaId: equipamento.categoriaId,
              codigoLocalizacao: equipamento.codigoLocalizacao,
              linkDiagrama: equipamento.linkDiagrama,
            });
          } else {
            this.snackBar.open('Equipamento não encontrado', 'Fechar', {
              duration: 5000,
            });
            this.voltar();
          }
          this.carregando.set(false);
        },
        error: (erro) => {
          console.error('Erro ao carregar equipamento:', erro);
          this.snackBar.open('Erro ao carregar equipamento', 'Fechar', {
            duration: 5000,
          });
          this.carregando.set(false);
        },
      });
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.salvando.set(true);

    const dadosFormulario = this.formulario.value;

    // Encontrar a categoria e localização selecionadas para incluir os nomes
    const categoriaSelecionada = this.categorias.find(
      (c) => c.id === dadosFormulario.categoriaId
    );
    const localizacaoSelecionada = this.localizacoes.find(
      (l) => l.codigo === dadosFormulario.codigoLocalizacao
    );

    const equipamento = {
      ...dadosFormulario,
      categoria: categoriaSelecionada?.nome || '',
      localizacao: localizacaoSelecionada?.nome || '',
    };

    const operacao = this.isEdicao
      ? this.equipamentoService.atualizar(this.equipamentoId!, equipamento)
      : this.equipamentoService.criar(equipamento);

    operacao.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const mensagem = this.isEdicao
          ? 'Equipamento atualizado com sucesso!'
          : 'Equipamento criado com sucesso!';

        this.snackBar.open(mensagem, 'Fechar', {
          duration: 3000,
        });

        this.voltar();
      },
      error: (erro) => {
        console.error('Erro ao salvar equipamento:', erro);
        const mensagem = this.isEdicao
          ? 'Erro ao atualizar equipamento'
          : 'Erro ao criar equipamento';

        this.snackBar.open(mensagem, 'Fechar', {
          duration: 5000,
        });
        this.salvando.set(false);
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/cadastrosBasicos/equipamentos']);
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach((campo) => {
      this.formulario.get(campo)?.markAsTouched();
    });
  }

  // Getters para facilitar o acesso aos controles do formulário
  get codigo() {
    return this.formulario.get('codigo');
  }
  get categoriaId() {
    return this.formulario.get('categoriaId');
  }
  get codigoLocalizacao() {
    return this.formulario.get('codigoLocalizacao');
  }
  get linkDiagrama() {
    return this.formulario.get('linkDiagrama');
  }

  // Métodos para verificar erros
  temErro(campo: string, erro: string): boolean {
    const controle = this.formulario.get(campo);
    return !!(controle?.hasError(erro) && controle?.touched);
  }

  obterMensagemErro(campo: string): string {
    const controle = this.formulario.get(campo);

    if (controle?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (controle?.hasError('maxlength')) {
      const maxLength = controle.errors?.['maxlength']?.requiredLength;
      return `Máximo de ${maxLength} caracteres`;
    }

    return '';
  }
}
