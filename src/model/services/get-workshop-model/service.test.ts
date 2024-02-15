import { describe, expect, spyOn, test } from 'bun:test';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';
import { GettingWorkshopModelService } from './service';
import { ModelServiceFixtures } from '../fixtures';
import { success } from 'rilata/src/common/result/success';
import { setAndGetTestStoreDispatcher } from 'rilata/tests/fixtures/test-thread-store-mock';
import { failure } from 'rilata/src/common/result/failure';
import { dtoUtility } from 'rilata/src/common/utils/dto/dto-utility';

describe('get workshop model tests', () => {
    const sut = new GettingWorkshopModelService();
    sut.init(resolver);

    test('success, model returned', async () => {
        const modelRepoMock = ModelServiceFixtures.resolverGetRepoMock();
        const repoGetWorkshopModelMock = spyOn(modelRepoMock, 'getWorkshopModel').mockResolvedValueOnce(success(ModelServiceFixtures.workshopModels[0]));
        setAndGetTestStoreDispatcher('233c916e-0078-4370-9534-8ad9a41caff1');
        const result = await sut.execute(ModelServiceFixtures.validGetWorkshopModelActionDod);
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toEqual(ModelServiceFixtures.workshopModels[0]);
        expect(repoGetWorkshopModelMock).toHaveBeenCalledTimes(1);
        expect(repoGetWorkshopModelMock.mock.calls[0][0]).toEqual('e59725e7-39ae-48cd-aa10-a0f9a00c0fd9');
        expect(repoGetWorkshopModelMock.mock.calls[0][1]).toEqual('0f6df660-80dc-466c-b9f9-d8317f6f47dc');
        repoGetWorkshopModelMock.mockClear();
    });

    test('fail, workshop with that workshop id isnt exist', async () => {
        const modelRepoMock = ModelServiceFixtures.resolverGetRepoMock();
        const repoGetWorkshopModelMock = spyOn(modelRepoMock, 'getWorkshopModel').mockResolvedValueOnce(failure(ModelServiceFixtures.WorkshopIsntExistError));
        setAndGetTestStoreDispatcher('233c916e-0078-4370-9534-8ad9a41caff1');
        const invalidGetWorkshopModelActionDod = dtoUtility.deepCopy(ModelServiceFixtures.validGetWorkshopModelActionDod);
        invalidGetWorkshopModelActionDod.attrs.workshopId = 'a3bbf31e-28ee-43cc-8fb9-a56ec4316e9b';
        const result = await sut.execute(invalidGetWorkshopModelActionDod);
        expect(result.isSuccess()).toBe(false);
        expect(result.value).toEqual(ModelServiceFixtures.WorkshopIsntExistError);
        expect(repoGetWorkshopModelMock).toHaveBeenCalledTimes(1);
        expect(repoGetWorkshopModelMock.mock.calls[0][0]).toEqual('a3bbf31e-28ee-43cc-8fb9-a56ec4316e9b');
        expect(repoGetWorkshopModelMock.mock.calls[0][1]).toEqual('0f6df660-80dc-466c-b9f9-d8317f6f47dc');
        repoGetWorkshopModelMock.mockClear();
    });
    
    test('fail, model with that model id isnt exist', async () => {
        const modelRepoMock = ModelServiceFixtures.resolverGetRepoMock();
        const repoGetWorkshopModelMock = spyOn(modelRepoMock, 'getWorkshopModel').mockResolvedValueOnce(failure(ModelServiceFixtures.ModelIsntExistError));
        setAndGetTestStoreDispatcher('233c916e-0078-4370-9534-8ad9a41caff1');
        const invalidGetWorkshopModelActionDod = dtoUtility.deepCopy(ModelServiceFixtures.validGetWorkshopModelActionDod);
        invalidGetWorkshopModelActionDod.attrs.modelId = '29c8cb14-c75e-4c20-8051-af02e91d9be9';
        const result = await sut.execute(invalidGetWorkshopModelActionDod);
        expect(result.isSuccess()).toBe(false);
        expect(result.value).toEqual(ModelServiceFixtures.ModelIsntExistError);
        expect(repoGetWorkshopModelMock).toHaveBeenCalledTimes(1);
        expect(repoGetWorkshopModelMock.mock.calls[0][0]).toEqual('e59725e7-39ae-48cd-aa10-a0f9a00c0fd9');
        expect(repoGetWorkshopModelMock.mock.calls[0][1]).toEqual('29c8cb14-c75e-4c20-8051-af02e91d9be9');
        repoGetWorkshopModelMock.mockClear();
    });
})
