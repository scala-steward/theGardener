package repository

import models._
import org.scalatest.BeforeAndAfterEach
import org.scalatest.concurrent._
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.test.Injecting

import scala.concurrent.duration._

class BranchRepositoryTest extends PlaySpec with GuiceOneServerPerSuite with Injecting with BeforeAndAfterEach with ScalaFutures {
  override implicit val patienceConfig = PatienceConfig(timeout = scaled(30.seconds))

  val branchRepository = inject[BranchRepository]

  import slick.jdbc.H2Profile.api._

  val db = Database.forConfig("h2mem1")

  val branch1 = Branch(1, "name", isStable = true, "project1")
  val branch2 = Branch(2, "name2", isStable = true, "project1")
  val branch3 = Branch(3, "name3", isStable = false, "project2")
  val branches = Seq(branch1, branch2, branch3)

  override def beforeEach() {
    db.run(DBIO.sequence(branches.map { branch =>
      sqlu"INSERT INTO branch (id, name, isStable, projectId) VALUES (${branch.id}, ${branch.name}, ${branch.isStable}, ${branch.projectId})"
    }))
  }

  override def afterEach() {
    db.run(sqlu"TRUNCATE TABLE branch")
    db.run(sqlu"ALTER TABLE branch ALTER COLUMN id RESTART WITH 1")
  }

  "GetFeatureRepository" should {
    "count the number of branches" in {
      whenReady(branchRepository.count())(_ mustBe 3)
    }

//    "delete all branches" in {
//      branchRepository.deleteAll()
//      db.withConnection { implicit connection =>
//        SQL"SELECT COUNT(*) FROM branch".as(scalar[Long].single) mustBe 0
//      }
//    }
//
//    "delete a branch" in {
//      branchRepository.delete(branch1)
//    }
//
//    "delete a branch by id" in {
//      branchRepository.deleteById(branch1.id)
//      db.withConnection { implicit connection =>
//        SQL"SELECT COUNT(*) FROM branch WHERE id = ${branch1.id}".as(scalar[Long].single) mustBe 0
//      }
//    }
//
//    "find all by id" in {
//      branchRepository.findAllById(branches.tail.map(_.id)) must contain theSameElementsAs branches.tail
//    }
//
//    "find a branch by id" in {
//      branchRepository.findById(branch1.id) mustBe Some(branch1)
//    }
//
//    "get all branches" in {
//      branchRepository.findAll() must contain theSameElementsAs branches
//    }
//
//    "get all branches by projectId" in {
//      branchRepository.findAllByProjectId("project1") must contain theSameElementsAs Seq(branch1, branch2)
//    }
//
//    "check if a branch exist by id" in {
//      branchRepository.existsById(branch1.id) mustBe true
//    }
//
//    "save a branch" in {
//      val newBranch = Branch(-1, "name4", isStable = false, "project1")
//      branchRepository.save(newBranch) mustBe newBranch.copy(id = 4)
//    }
//
//    "update a branch" in {
//      val updatedBranch = branch1.copy(isStable = false)
//      branchRepository.save(updatedBranch) mustBe updatedBranch
//      branchRepository.findAll() must contain theSameElementsAs Seq(updatedBranch, branch2, branch3)
//    }
//
//    "save all branches by projectId" in {
//      val branch4 = Branch(-1, "name4", isStable = false, "project1")
//      val branch5 = Branch(-1, "name5", isStable = true, "project1")
//      val expectedBranches = Seq(branch4.copy(id = 4), branch5.copy(id = 5))
//
//      branchRepository.saveAll(Seq(branch4, branch5)) must contain theSameElementsAs expectedBranches
//      branchRepository.findAll() must contain theSameElementsAs branches ++ expectedBranches
//    }
  }
}

