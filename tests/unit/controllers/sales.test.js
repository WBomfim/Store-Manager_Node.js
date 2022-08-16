const { expect } = require('chai');
const sinon = require('sinon');
const salesService = require('../../../services/sales');
const salesController = require('../../../controllers/sales');

describe('Controllers - Quando chamar o controller addSale', () => {
  const req = {};
  const res = {};

  describe('E não for enviado o id do produto na requisição', () => {
    before(() => {
      req.body = [{ "quantity": 1 }];
      res.status = sinon.stub().returnsThis();
      res.json = sinon.stub().returns();
      const OBJECT_ERROR = { code: 400, error: '"productId" is required' };
      sinon.stub(salesService, 'addSale').resolves(OBJECT_ERROR);
    });

    after(() => salesService.addSale.restore());

    it('Deve retornar o status com o código 400', async () => {
      await salesController.addSale(req, res);
      expect(res.status.calledWith(400)).to.be.equal(true);
    });

    it('Deve retornar o objeto com a menssagem de erro "productId" is required', async () => {
      const OBJECT_RES = { message: '"productId" is required' };
      await salesController.addSale(req, res);
      expect(res.json.calledWith(OBJECT_RES)).to.be.equal(true);
    });
  });

  describe('E não for enviado a quantidade do produto na requisição', () => {
    before(() => {
      req.body = [{ "productId": 1 }];
      res.status = sinon.stub().returnsThis();
      res.json = sinon.stub().returns();
      const OBJECT_ERROR = { code: 400, error: '"quantity" is required' };
      sinon.stub(salesService, 'addSale').resolves(OBJECT_ERROR);
    });

    after(() => salesService.addSale.restore());

    it('Deve retornar o status com o código 400', async () => {
      await salesController.addSale(req, res);
      expect(res.status.calledWith(400)).to.be.equal(true);
    });

    it('Deve retornar o objeto com a menssagem de erro "quantity" is required', async () => {
      const OBJECT_RES = { message: '"quantity" is required' };
      await salesController.addSale(req, res);
      expect(res.json.calledWith(OBJECT_RES)).to.be.equal(true);
    });
  });

  describe('E o id do produto não é um número', () => {
    before(() => {
      req.body = [{ "productId": "A", "quantity": 1 }];
      res.status = sinon.stub().returnsThis();
      res.json = sinon.stub().returns();
      const OBJECT_ERROR = { code: 400, error: '"productId" must be a number' };
      sinon.stub(salesService, 'addSale').resolves(OBJECT_ERROR);
    });

    after(() => salesService.addSale.restore());

    it('Deve retornar o status com o código 400', async () => {
      await salesController.addSale(req, res);
      expect(res.status.calledWith(400)).to.be.equal(true);
    });

    it('Deve retornar o objeto com a menssagem de erro "productId" must be a number', async () => {
      const OBJECT_RES = { message: '"productId" must be a number' };
      await salesController.addSale(req, res);
      expect(res.json.calledWith(OBJECT_RES)).to.be.equal(true);
    });
  });

  describe('E a quantidade do produto não é um número', () => {
    before(() => {
      req.body = [{ "productId": 1, "quantity": "A" }];
      res.status = sinon.stub().returnsThis();
      res.json = sinon.stub().returns();
      const OBJECT_ERROR = { code: 400, error: '"quantity" must be a number' };
      sinon.stub(salesService, 'addSale').resolves(OBJECT_ERROR);
    });

    after(() => salesService.addSale.restore());

    it('Deve retornar o status com o código 400', async () => {
      await salesController.addSale(req, res);
      expect(res.status.calledWith(400)).to.be.equal(true);
    });

    it('Deve retornar o objeto com a menssagem de erro "quantity" must be a number', async () => {
      const OBJECT_RES = { message: '"quantity" must be a number' };
      await salesController.addSale(req, res);
      expect(res.json.calledWith(OBJECT_RES)).to.be.equal(true);
    });
  });

  describe('E a quantidade do produto é menor ou igual a 0', () => {
    before(() => {
      req.body = [{ "productId": 1, "quantity": 0 }];
      res.status = sinon.stub().returnsThis();
      res.json = sinon.stub().returns();
      const OBJECT_ERROR = { code: 422, error: '"quantity" must be greater than or equal to 1' };
      sinon.stub(salesService, 'addSale').resolves(OBJECT_ERROR);
    });

    after(() => salesService.addSale.restore());

    it('Deve retornar o status com o código 400', async () => {
      await salesController.addSale(req, res);
      expect(res.status.calledWith(422)).to.be.equal(true);
    });

    it('Deve retornar o objeto com a menssagem de erro "quantity" must be greater than or equal to 1', async () => {
      const OBJECT_RES = { message: '"quantity" must be greater than or equal to 1' };
      await salesController.addSale(req, res);
      expect(res.json.calledWith(OBJECT_RES)).to.be.equal(true);
    });
  });

  describe('E o produto enviado na requisição não está cadastrado no banco de dados', () => {
    before(() => {
      req.body = [{ "productId": 100, "quantity": 1 }];
      res.status = sinon.stub().returnsThis();
      res.json = sinon.stub().returns();
      const OBJECT_ERROR = { code: 404, error: 'Product not found' };
      sinon.stub(salesService, 'addSale').resolves(OBJECT_ERROR);
    });

    after(() => salesService.addSale.restore());

    it('Deve retornar o status com o código 404', async () => {
      await salesController.addSale(req, res);
      expect(res.status.calledWith(404)).to.be.equal(true);
    });

    it('Deve retornar o objeto com a menssagem de erro "Product not found"', async () => {
      const OBJECT_RES = { message: 'Product not found' };
      await salesController.addSale(req, res);
      expect(res.json.calledWith(OBJECT_RES)).to.be.equal(true);
    });
  });

  describe('E o as informações enviadas na requisição estão corretas', () => {
    before(() => {
      req.body = [
        {
          "productId": 1,
          "quantity": 1
        },
        {
          "productId": 2,
          "quantity": 5
        }
      ];

      res.status = sinon.stub().returnsThis();
      res.json = sinon.stub().returns();

      const OBJECT_OK = {
        code: 200,
        data: {
          "id": 5,
          "itemsSold": [
            {
              "productId": 1,
              "quantity": 1
            }, {
              "productId": 2,
              "quantity": 5
            }
          ]
        }
      };

      sinon.stub(salesService, 'addSale').resolves(OBJECT_OK);
    });

    after(() => salesService.addSale.restore());

    it('Deve retornar o status com o código 200', async () => {
      await salesController.addSale(req, res);
      expect(res.status.calledWith(200)).to.be.equal(true);
    });

    it('Deve retornar o objeto com os dados da venda cadastrada', async () => {
      const OBJECT_RES = {
        "id": 5,
        "itemsSold": [
          {
            "productId": 1,
            "quantity": 1
          },
          {
            "productId": 2,
            "quantity": 5
          }
        ]
      };
      
      await salesController.addSale(req, res);
      expect(res.json.calledWith(OBJECT_RES)).to.be.equal(true);
    });
  });
});