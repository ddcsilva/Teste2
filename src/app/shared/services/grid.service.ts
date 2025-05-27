import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, switchMap, take } from 'rxjs';
import { MensagensOperacao } from '../models/mensagens-operacao.model';
import { ExportacaoService } from './exportacao.service';
import { DialogService } from './dialog.service';
import { TratamentoErroService } from './tratamento-erro.service';
import { DadosDialog } from '../models/dados-dialog.model';
import { OperacaoService } from './operacao.service';
import { ResponseGeneric } from '../../core/models/response-generic';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  constructor(
    private dialogService: DialogService,
    private operacaoService: OperacaoService,
    private exportacaoService: ExportacaoService,
    private tratamentoErroService: TratamentoErroService
  ) {}

  confirmarEExcluir<T>(
    mensagem: DadosDialog,
    id: number,
    funcaoExcluir: (id: number) => Observable<ResponseGeneric>,
    funcaoAtualizar: () => void,
    mensagens?: MensagensOperacao
  ): void {
    this.dialogService
      .confirmar({
        title: mensagem.title,
        content: mensagem.content,
        cancelText: mensagem.cancelText,
        confirmText: mensagem.confirmText,
      })
      .pipe(
        take(1),
        switchMap((confirmado: boolean) => {
          if (confirmado) {
            return this.operacaoService.executarOperacao(
              'excluir',
              () => funcaoExcluir(id),
              funcaoAtualizar,
              mensagens
            );
          }
          return EMPTY;
        }),
        catchError(
          this.tratamentoErroService.tratarErro(
            'Houve um erro ao excluir o registro.',
            null
          )
        )
      )
      .subscribe();
  }

  exportarDadosParaExcel<T>(
    funcaoExportar: () => Observable<T>,
    nomeArquivo: string
  ): void {
    this.exportacaoService.exportarExcel(funcaoExportar, nomeArquivo);
  }
}
