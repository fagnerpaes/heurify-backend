// In-memory storage for all entities
class InMemoryStore {
  constructor() {
    this.usuarios = new Map();
    this.heuristicas = new Map();
    this.chartersGerados = new Map();
    this.sessoesSbtm = new Map();
    this.achados = new Map();
  }

  // Usuarios
  salvarUsuario(usuario) {
    this.usuarios.set(usuario.id, usuario);
    return usuario;
  }

  obterUsuarioPorId(id) {
    return this.usuarios.get(id);
  }

  obterUsuarioPorEmail(email) {
    for (const usuario of this.usuarios.values()) {
      if (usuario.email === email) return usuario;
    }
    return null;
  }

  listarUsuarios() {
    return Array.from(this.usuarios.values());
  }

  // Heurísticas
  salvarHeuristica(heuristica) {
    this.heuristicas.set(heuristica.id, heuristica);
    return heuristica;
  }

  obterHeuristicaPorId(id) {
    return this.heuristicas.get(id);
  }

  listarHeuristicas(filtro = {}) {
    let items = Array.from(this.heuristicas.values());

    if (filtro.search) {
      const term = filtro.search.toLowerCase();
      items = items.filter(
        (h) =>
          h.title.toLowerCase().includes(term) ||
          h.description.toLowerCase().includes(term) ||
          h.tags &&h.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    if (filtro.status) {
      items = items.filter((h) => h.status === filtro.status);
    }

    if (filtro.technique) {
      items = items.filter((h) => h.technique === filtro.technique);
    }

    // Paginação
    if (filtro.limit) {
      const skip = filtro.skip || 0;
      items = items.slice(skip, skip + filtro.limit);
    }

    return items;
  }

  atualizarHeuristica(id, updates) {
    const heuristica = this.heuristicas.get(id);
    if (!heuristica) return null;
    const atualizada = { ...heuristica, ...updates, id: heuristica.id };
    this.heuristicas.set(id, atualizada);
    return atualizada;
  }

  deletarHeuristica(id) {
    return this.heuristicas.delete(id);
  }

  // Charters
  salvarCharter(charter) {
    this.chartersGerados.set(charter.id, charter);
    return charter;
  }

  obterCharterPorId(id) {
    return this.chartersGerados.get(id);
  }

  listarCharters(heuristicaId = null) {
    let items = Array.from(this.chartersGerados.values());
    if (heuristicaId) {
      items = items.filter((c) => c.heuristicaId === heuristicaId);
    }
    return items;
  }

  deletarCharter(id) {
    return this.chartersGerados.delete(id);
  }

  atualizarCharter(id, updates) {
    const charter = this.chartersGerados.get(id);
    if (!charter) return null;
    const atualizado = { ...charter, ...updates, id: charter.id };
    this.chartersGerados.set(id, atualizado);
    return atualizado;
  }

  // Sessões SBTM
  salvarSessao(sessao) {
    this.sessoesSbtm.set(sessao.id, sessao);
    return sessao;
  }

  obterSessaoPorId(id) {
    return this.sessoesSbtm.get(id);
  }

  listarSessoes(usuarioId = null) {
    let items = Array.from(this.sessoesSbtm.values());
    if (usuarioId) {
      items = items.filter((s) => s.usuarioId === usuarioId);
    }
    return items;
  }

  atualizarSessao(id, updates) {
    const sessao = this.sessoesSbtm.get(id);
    if (!sessao) return null;
    const atualizada = { ...sessao, ...updates, id: sessao.id };
    this.sessoesSbtm.set(id, atualizada);
    return atualizada;
  }

  deletarSessao(id) {
    return this.sessoesSbtm.delete(id);
  }

  // Achados
  salvarAchado(achado) {
    if (!this.achados.has(achado.sessaoId)) {
      this.achados.set(achado.sessaoId, []);
    }
    const achados = this.achados.get(achado.sessaoId);
    achados.push(achado);
    return achado;
  }

  obterAchadoPorId(sessaoId, id) {
    const achados = this.achados.get(sessaoId) || [];
    return achados.find((a) => a.id === id);
  }

  listarAchados(sessaoId) {
    return this.achados.get(sessaoId) || [];
  }

  atualizarAchado(sessaoId, id, updates) {
    const achados = this.achados.get(sessaoId) || [];
    const index = achados.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const atualizado = { ...achados[index], ...updates, id: achados[index].id };
    achados[index] = atualizado;
    return atualizado;
  }

  deletarAchado(sessaoId, id) {
    const achados = this.achados.get(sessaoId) || [];
    const index = achados.findIndex((a) => a.id === id);
    if (index === -1) return false;
    achados.splice(index, 1);
    return true;
  }

  // Estatísticas para dashboard
  obterEstatisticas() {
    return {
      totalHeuristicas: this.heuristicas.size,
      totalSessoes: this.sessoesSbtm.size,
      totalAchados: Array.from(this.achados.values()).reduce((sum, arr) => sum + arr.length, 0),
      totalUsuarios: this.usuarios.size,
      heuristicasPorStatus: this._contarPorStatus(),
      sessoesPorUsuario: this._contarSessoesPorUsuario(),
    };
  }

  _contarPorStatus() {
    const contagem = {};
    for (const heuristica of this.heuristicas.values()) {
      contagem[heuristica.status] = (contagem[heuristica.status] || 0) + 1;
    }
    return contagem;
  }

  _contarSessoesPorUsuario() {
    const contagem = {};
    for (const sessao of this.sessoesSbtm.values()) {
      contagem[sessao.usuarioId] = (contagem[sessao.usuarioId] || 0) + 1;
    }
    return contagem;
  }
}

export const store = new InMemoryStore();
