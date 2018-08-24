import {
    AddToQueue,
    AddToQueueData,
    FromQueue,
    Job,
    logger, NoneWorkerFactory,
    OnStart,
    PuppeteerUtil,
    PuppeteerWorkerFactory
} from "ppspider";
import {Page} from "puppeteer";

export class TestTask {

    @OnStart({
        urls: "http://www.baidu.com",
        workerFactory: PuppeteerWorkerFactory,
        parallel: {
            "0/20 * * * * ?": 1,
            "10/20 * * * * ?": 2
        }
    })
    @AddToQueue({
        name: "test"
    })
    async index(page: Page, job: Job): AddToQueueData {
        await page.goto(job.url());
        return PuppeteerUtil.links(page, {
            "test": "http.*"
        });
    }

    @FromQueue({
        name: "test",
        workerFactory: NoneWorkerFactory,
        parallel: 1,
        exeInterval: 1000
    })
    async printUrl(useless: any, job: Job) {
        logger.debug(job.url());
    }

}