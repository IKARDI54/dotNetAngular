using BackendApi.Models;

namespace BackendApi.Services.Contrato
{
    public interface IDepartamentoService
    {
        Task<List<Departamento>> GetList();
    }
}
