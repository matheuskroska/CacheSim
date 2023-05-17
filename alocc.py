#!/usr/bin

"""
info: simple module that realizes simulatiuo
developed by: dev.marcio.rocha@gmail.com
"""

import time

# posicoes da lista acima
POSITIONS = [0, 2, 3, 5, 10, 15, 25, 0, 40, 42]
# memoria cache
CACHE = [None, None, None, None, None, None, None, None, None, None, None, None]
# timestamp do acesso a cada posicao da cache
TIMESTAMPS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
# tamanho da memoria cache
CACHE_SIZE = len(CACHE)
# numero de conjuntos da memoria cache
CACHE_SET_NUMBER = 3
# numero de blocos por conjunto da memoria cache
SET_BLOCK_NUMBER = int(CACHE_SIZE / CACHE_SET_NUMBER)


def sort_timestamps(timestamp_list: list) -> list:
    """realizar ordenacao de um array de tuplas de ts+posicao"""
    key = lambda x: x[0]
    ts_sorted = sorted(timestamp_list, key=key)
    return ts_sorted


def get_set_range(posicao_acessada: int) -> tuple:
    """realizar identificacao de range do conjunto referente a posicao acessada"""
    begin_pos = (posicao_acessada % CACHE_SET_NUMBER) * SET_BLOCK_NUMBER
    end_position = begin_pos + SET_BLOCK_NUMBER - 1
    return (begin_pos, end_position)


def direct_mapping(cache, position) -> None:
    """realizar mapeamento direto """
    cache[position%len(cache)] = position


# note que estou trabalhando com os objetos passados por
# referencia  e nao os objetos globais / copia de valores
def mapeamento_associativo_por_conjunto_fifo(position, cache, timestamps) -> None:
    """realizar mapeamento associativo"""
    # descobre o range referente ao conjunto afetado
    _set = get_set_range(posicao_acessada=position)
    # realiza a fatia do range no array de timestamps
    set_timestamps = timestamps[_set[0]:_set[1]+1]
    # gera um array de tuplas de timestamps e seus referentes indices
    timestamp_list = [(t,timestamps.index(t)) for t in set_timestamps]
    # realiza a ordenacao deste array de tuplas pelo primeiro elemento (timestamp)
    ts_sorted = sort_timestamps(timestamp_list)
    # descobre a posicao da cache pela ordenacao + conjunto
    index = ts_sorted[0][1]+_set[0]
    # atribui o valor na cache no indice calculado acima
    cache[index] = position
    # realiza atualizacao do timestamp referente ao indice atualizado
    timestamps[index] = time.time()
    return 0  # somete para determinar fim da funcao


def realizar_acessos(strategy, access, cache, timestamps):
    """realiza o controle de acessos e politica de substituicao"""
    if 'direto' == strategy:
        for posicao in access:
            direct_mapping(
                cache=cache
                , position=posicao
            )
    elif 'FIFO' == strategy:
        for posicao in access:
            mapeamento_associativo_por_conjunto_fifo(
                position=posicao
                , cache=cache
                , timestamps=timestamps
            )
    elif 'LILO' == strategy:
        return

realizar_acessos('FIFO', POSITIONS, CACHE, TIMESTAMPS)
